"use client"

import { env } from "@movie-ticket-booking/env/web";
import type { Region, TMDBMoviesType } from "@movie-ticket-booking/shared/types";
import { useQuery } from "@tanstack/react-query";

interface MoviesResponse {
  data: {
    movies: TMDBMoviesType[];
  };
}

export function useMoviesFeed(region: Region) {
  return useQuery<TMDBMoviesType[]>({
    queryKey: ["fetch-movies-feed"],
    queryFn: () => fetchFeedMovies(region),
  });
}

export function useSearchMovies(searchString: string) {
  return useQuery<MoviesResponse>({
    queryKey: ["search-movies", searchString], // keyed on debounced value
    queryFn: () => searchMovies(searchString),
  });
}

async function searchMovies(searchString: string) {
  const url =
    env.NEXT_PUBLIC_SERVER_URL + `/movies/search?searchString=${encodeURIComponent(searchString)}`;
  const res = await fetch(url, {
    method: "GET",
  });
  return res.json();
}

async function fetchFeedMovies(region: Region) {
  const url = env.NEXT_PUBLIC_SERVER_URL + `/movies/feed`;
  const res = await fetch(url, {
    method: "GET",
    body: JSON.stringify({
      region,
    }),
  });
  return res.json();
}
