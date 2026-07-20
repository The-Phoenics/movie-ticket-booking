"use client";

import type { TMDBMovieType } from "@movie-ticket-booking/shared/types";
import { cn } from "@/lib/utils";

export function MovieSummary({ movie }: { movie: TMDBMovieType }) {
  if (!movie) {
    return null;
  }

  const genres = movie.genres ? movie.genres.slice(0, 4) : [];

  return (
    <div className="relative flex justify-center overflow-hidden border-b w-full border-zinc-800">
      <div className="max-w-2xl">
        {movie.img && (
          <div className="absolute inset-0 w-full h-full">
            <img
              src={movie.img}
              alt=""
              aria-hidden="true"
              className="h-full w-full scale-110 object-cover blur-2xl opacity-40"
            />
            <div className="absolute inset-0 bg-linear-to-r from-zinc-950/95 via-zinc-950/85 to-zinc-950/60" />
            <div className="absolute inset-0 bg-linear-to-t from-zinc-950/80 via-transparent to-transparent" />
          </div>
        )}

        {/* Fallback background when there's no image */}
        {!movie.img && (
          <div className="absolute inset-0 bg-[linear-gradient(160deg,#18181b_0%,#09090b_60%,#0a0a12_100%)]" />
        )}

        {/* Content */}
        <div className="relative flex gap-5 h-full p-5">
          {movie.img && (
            <img
              src={movie.img}
              alt={movie.title}
              className="w-32 h-full shrink-0 rounded-lg object-cover shadow-lg shadow-black/50 ring-1 ring-white/10"
            />
          )}

          <div className="min-w-0 flex flex-col justify-center">
            <h3 className="truncate text-xl font-semibold tracking-tight text-zinc-50">{movie.title}</h3>

            {genres && genres.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {genres.map((g) => (
                  <span
                    key={g.id}
                    className={cn(
                      "rounded-full border border-zinc-700/80 bg-zinc-900/60 px-2.5 py-0.5",
                      "text-[10px] font-medium uppercase tracking-wider text-zinc-400",
                    )}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {movie.overview && (
              <p className="mt-3 line-clamp-7 max-w-2xl text-sm leading-relaxed tracking-wide text-zinc-400">
                {movie.overview}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
