"use client";

import { Star, MapPin, Clock, CalendarDays } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useMovieWithTimings, type DatesWithTheatreTimings } from "./query";
import { formatDatePillParts, formatTime } from "@/lib/utils";
import type { Movie } from "@movie-ticket-booking/shared/types";

export default function MoviePage() {
  const params = useParams<{ movieId: string }>();
  const router = useRouter();
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);
  const fetchMovieQuery = useMovieWithTimings(params.movieId);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [datesWithTheatreTimings, setDatesWithTheatreTimings] = useState<DatesWithTheatreTimings | null>(null);

  useEffect(() => {
    const data = fetchMovieQuery.data;
    setMovie(data?.movie ?? null);
    setDatesWithTheatreTimings(data?.datesWithTheatreTimings ?? null);
  }, [fetchMovieQuery.data]);

  // All derived showtime data lives behind one null-safe memo. When
  // `datesWithTheatreTimings` hasn't arrived yet (still pending, or the
  // movie genuinely has no showtimes), every field below falls back to an
  // empty/neutral value instead of throwing.
  const { dateGroupKeys, activeDateKey, sortedTheatreEntries } = useMemo(() => {
    if (!datesWithTheatreTimings) {
      return {
        dateGroupKeys: [] as string[],
        activeDateKey: null as string | null,
        sortedTheatreEntries: [] as [string, DatesWithTheatreTimings[string][string]][],
      };
    }

    const keys = Object.keys(datesWithTheatreTimings).sort((a, b) => {
      const aFirst = Object.values(datesWithTheatreTimings[a])[0]?.dates[0]?.start;
      const bFirst = Object.values(datesWithTheatreTimings[b])[0]?.dates[0]?.start;
      if (!aFirst || !bFirst) return 0;
      return new Date(aFirst).getTime() - new Date(bFirst).getTime();
    });

    // Default to the first (earliest) date once data loads.
    const active = selectedDateKey && keys.includes(selectedDateKey) ? selectedDateKey : (keys[0] ?? null);
    const activeTheatres = active ? datesWithTheatreTimings[active] : undefined;

    // Sort theatres alphabetically by name for the horizontal list.
    const sortedEntries = activeTheatres
      ? Object.entries(activeTheatres).sort((a, b) => a[1].theatreData.title.localeCompare(b[1].theatreData.title))
      : [];

    return { dateGroupKeys: keys, activeDateKey: active, sortedTheatreEntries: sortedEntries };
  }, [datesWithTheatreTimings, selectedDateKey]);

  if (fetchMovieQuery.isPending) {
    return (
      <div className="container py-20">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-12 w-64 rounded bg-muted" />
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="h-32 rounded bg-muted" />
        </div>
      </div>
    );
  }

  if (fetchMovieQuery.isError || !movie) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-semibold">Movie not found</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

        <div className="relative container mx-auto px-6 py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            <div className="h-105 w-70 rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
              <div className="flex h-full items-center justify-center text-zinc-600">Poster</div>
            </div>

            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-yellow-400">
                <Star className="h-4 w-4 fill-yellow-400" />
                {movie.vote_average}/10
              </div>

              <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">{movie.title}</h1>

              <p className="mb-8 text-lg leading-relaxed text-zinc-300">{movie.overview}</p>

              <div className="flex gap-4">
                <button className="rounded-md bg-red-600 px-8 py-4 font-semibold transition hover:bg-red-700">
                  Book Tickets
                </button>
                <button className="rounded-md border border-white/10 bg-white/5 px-8 py-4 font-semibold backdrop-blur hover:bg-white/10">
                  Watch Trailer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="mt-0 lg:col-span-3">
            <h2 className="mb-6 text-2xl font-bold">Showtimes</h2>

            {dateGroupKeys.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-8 text-center text-zinc-500">
                No showtimes scheduled yet — check back soon.
              </div>
            ) : (
              <div>
                {/* ── Date carousel ── */}
                <div className="mb-8 flex items-center gap-3 overflow-x-auto pb-2">
                  <div className="flex shrink-0 items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Date
                  </div>
                  {dateGroupKeys.map((dateKey) => {
                    const firstSlotStart = Object.values(datesWithTheatreTimings![dateKey])[0]?.dates[0]?.start;
                    if (!firstSlotStart) return null;
                    const { day, date, month } = formatDatePillParts(firstSlotStart);
                    const isActive = dateKey === activeDateKey;

                    return (
                      <button
                        key={dateKey}
                        onClick={() => setSelectedDateKey(dateKey)}
                        className={`flex shrink-0 flex-col items-center rounded-lg border px-4 py-2 transition ${
                          isActive
                            ? "border-red-500 bg-red-600 text-white"
                            : "border-white/10 bg-white/5 text-zinc-300 hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                        }`}
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-wide">{day}</span>
                        <span className="text-lg font-bold leading-tight">{date}</span>
                        <span className="text-[11px] opacity-80">{month}</span>
                      </button>
                    );
                  })}
                </div>

                {/* ── Theatres for the selected date, shown horizontally ── */}
                {sortedTheatreEntries.length === 0 ? (
                  <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-8 text-center text-zinc-500">
                    No theatres showing this movie on the selected date.
                  </div>
                ) : (
                  <div className="flex flex-col justify-between gap-5 overflow-x-auto pb-3">
                    {sortedTheatreEntries.map(([theatreId, { theatreData, dates }]) => (
                      <div
                        key={theatreId}
                        className="w-full flex md:flex-row flex-col gap-4 shrink-0 rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur"
                      >
                        <div className="md:min-w-1/3">
                          <p className="font-semibold">{theatreData.title}</p>
                          <p className="flex items-center gap-1.5 text-sm text-zinc-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {theatreData.address}, {theatreData.city}, {theatreData.country}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          {dates
                            .slice()
                            .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
                            .map((slot, idx) => {
                              const hasId = Boolean(slot.showId);
                              return (
                                <button
                                  key={`${theatreId}-${idx}`}
                                  disabled={!hasId}
                                  onClick={() => {
                                    if (!hasId) return;
                                    router.push(`/movies/${params.movieId}/${slot.showId}`);
                                  }}
                                  title={hasId ? undefined : "This showtime is missing an id (backend data issue)"}
                                  className="flex items-center hover:cursor-pointer gap-1.5 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/5 disabled:hover:text-inherit"
                                >
                                  <Clock className="h-3.5 w-3.5" />
                                  {formatTime(slot.start)}
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
