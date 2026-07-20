import { env } from "@movie-ticket-booking/env/web";
import type { ServerApiResponseShape, TMDBMovieType } from "@movie-ticket-booking/shared/types";
import { useQuery } from "@tanstack/react-query";

export function useMovie(movieId: string) {
  return useQuery<TMDBMovieType>({
    queryKey: ["fetch-movie", movieId],
    queryFn: () => fetchMovie(movieId),
    enabled: !!movieId,
  });
}

async function fetchMovie(movieId: string) {
  const url = `${env.NEXT_PUBLIC_SERVER_URL}/movies/${movieId}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Couldn't find the requested movie");
  }
  const result: ServerApiResponseShape = await res.json();
  if (!result || !result.success) {
    throw new Error("Couldn't find the requested movie");
  }
  console.log("result data", result.data);
  return result.data;
}