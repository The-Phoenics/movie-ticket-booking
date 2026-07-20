import { env } from "@movie-ticket-booking/env/web";
import type { Region, TMDBMoviesType } from "@movie-ticket-booking/shared/types";
import { useQuery } from "@tanstack/react-query";

export function useMoviesFeed(region: Region) {
  return useQuery<TMDBMoviesType[]>({
    queryKey: ["fetch-movies-feed"],
    queryFn: () => fetchFeedMovies(region),
  });
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