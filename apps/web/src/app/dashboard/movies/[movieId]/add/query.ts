import { env } from "@movie-ticket-booking/env/web";
import type { Seat, TMDBMovieType } from "@movie-ticket-booking/shared/types";
import { useQuery } from "@tanstack/react-query";
import { set } from "date-fns";

export type AddMovieShowtimePayload = {
  time: Date;
  price: number;
};

export function useMovie(movieId: string) {
  return useQuery<{ data: TMDBMovieType }>({
    queryKey: ["fetch-movie", movieId],
    queryFn: () => fetchMovie(movieId),
    enabled: !!movieId,
  });
}

async function fetchMovie(movieId: string) {
  const url = `${env.NEXT_PUBLIC_SERVER_URL}/movies/${movieId}`;
  const res = await fetch(url);
  return res.json();
}

export async function addMovieShowToTheatre(theatreId: string, movieId: string, payload: AddMovieShowtimePayload) {
  const url = `${env.NEXT_PUBLIC_SERVER_URL}/owner/${theatreId}/movies/add`;
  let endTime = new Date(payload.time);
  endTime = set(endTime, {
    hours: endTime.getHours() + 3, // TODO: Hardcoded movie duration to 3 hours for now
  });
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      tmdbMovieId: movieId,
      startTime: payload.time,
      endTime: endTime,
      price: payload.price,
    }),
  });
  return res.json();
}
