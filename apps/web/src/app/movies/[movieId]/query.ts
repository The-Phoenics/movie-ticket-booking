import { env } from "@movie-ticket-booking/env/web";
import { useQuery } from "@tanstack/react-query";

interface Theatre {
  id: string;
  title: string;
  address: string;
  city: string;
  country: string;
}

interface ShowSlot {
  start: string;
  end: string;
  showId: string;
}

interface TheatreWithTimings {
  theatreData: Theatre;
  dates: ShowSlot[];
}

// Keyed by theatreId
type TheatreTimingsMap = Record<string, TheatreWithTimings>;

// Keyed by formatted date string, e.g. "25 June 2026"
export type DatesWithTheatreTimings = Record<string, TheatreTimingsMap>;

export interface Movie {
  id: string;
  title: string;
  description: string;
  rating: number;
  crew: Record<string, string>;
}

interface MovieResponse {
  movie: Movie;
  datesWithTheatreTimings: DatesWithTheatreTimings;
}

export function useFetchMovie(movieId: string) {
  return useQuery<MovieResponse>({
    queryKey: ["fetch-movie", movieId],
    queryFn: () => fetchMovieDetails(movieId),
    enabled: !!movieId,
  });
}

async function fetchMovieDetails(movieId: string) {
  const url = `${env.NEXT_PUBLIC_SERVER_URL}/movies/${movieId}`;
  const res = await fetch(url);
  return res.json();
}
