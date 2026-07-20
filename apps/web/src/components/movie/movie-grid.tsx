"use client";

import { Clapperboard, Search } from "lucide-react";
import MovieCard, { MovieCardSkeleton } from "@/components/movie/movie-card";
import type { TMDBMoviesType, User } from "@movie-ticket-booking/shared/types";
import type { ClientSessionUser } from "../providers/auth-provider";

export function MovieGrid({
  movies,
  isPending,
  isError,
  search,
  user,
  onShowAll,
}: {
  movies: TMDBMoviesType[];
  isPending: boolean;
  isError: boolean;
  search: string;
  user: ClientSessionUser;
  onShowAll: () => void;
}) {
  if (isPending) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
        {Array.from({ length: 8 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 px-4 text-center text-white/30">
        <Clapperboard size={48} strokeWidth={1} />
        <h2 className="[font-family:var(--display,'Fraunces',serif)] text-2xl font-semibold text-white/60 m-0">
          Failed to load movies
        </h2>
        <p className="text-[0.9375rem] m-0 max-w-[320px]">Please check your connection and try again.</p>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 px-4 text-center text-white/30">
        <Search size={48} strokeWidth={1} />
        <h2 className="[font-family:var(--display,'Fraunces',serif)] text-2xl font-semibold text-white/60 m-0">
          No results found
        </h2>
        <p className="text-[0.9375rem] m-0 max-w-[320px]">
          No films matched {search ? `"${search}"` : "your filters"}.
        </p>
        <button
          onClick={onShowAll}
          className="mt-2 py-2.5 px-6 bg-[#dc2626] text-white border-none rounded-lg text-[0.9375rem] font-semibold cursor-pointer [font-family:var(--body,'Archivo',sans-serif)] transition-colors duration-150 hover:bg-[#b91c1c]"
        >
          Show all movies
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} user={user} />
      ))}
    </div>
  );
}
