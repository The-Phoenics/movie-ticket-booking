"use client";

import { env } from "@movie-ticket-booking/env/web";
import { useQuery } from "@tanstack/react-query";
import type { Route } from "next";
import { useRouter } from "next/navigation";

export default function MoviesPage() {
  const router = useRouter();
  const { isPending, error, data } = useQuery({
    queryKey: ["moviesData"],
    queryFn: () => fetch(env.NEXT_PUBLIC_SERVER_URL + "/movies").then((res) => res.json()),
  });

  const handleMovieClick = (movieId: string) => {
    router.push(("/movies/" + movieId) as Route);
  };

  return (
    <div>
      <h1 className="font-medium text-2xl mb-2.5">Movie List:</h1>
      <div>
        {isPending && <div>Loading...</div>}
        {error && <div>Failed to fetch movies.</div>}
        {!isPending && !error && (
          <div>
            {data.data.movies.map((movie) => {
              return (
                <div
                  key={movie.id}
                  onClick={() => handleMovieClick(movie.id)}
                  className="border p-6 m-2 hover:cursor-pointer"
                >
                  {movie.title} --- {movie.description}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
