"use client";

import { env } from "@movie-ticket-booking/env/web";
import { useQuery } from "@tanstack/react-query";
import { Star, MapPin, Clock, CalendarDays } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

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
type DatesWithTheatreTimings = Record<string, TheatreTimingsMap>;

interface Movie {
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

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDateLabel(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

// Compact label for the date-carousel pill itself (day name + day number)
function formatDatePillParts(iso: string) {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-IN", { weekday: "short" }),
    date: d.getDate(),
    month: d.toLocaleDateString("en-IN", { month: "short" }),
  };
}

export default function MoviePage() {
  const params = useParams<{ movieId: string }>();
  const router = useRouter();

  const { data, isPending, error } = useQuery({
    queryKey: ["movie", params.movieId],
    queryFn: async (): Promise<MovieResponse> => {
      const res = await fetch(
        `${env.NEXT_PUBLIC_SERVER_URL}/movies/${params.movieId}`,
      );

      if (!res.ok) {
        throw new Error("Failed to fetch movie");
      }

      const json = await res.json();
      return json.data;
    },
    enabled: !!params.movieId,
  });

  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  if (isPending) {
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

  if (error || !data?.movie) {
    return (
      <div className="container py-20 text-center">
        <h2 className="text-2xl font-semibold">Movie not found</h2>
      </div>
    );
  }

  console.log("data:", data);
  const { movie, datesWithTheatreTimings } = data;

  // The backend keys groups by a formatted display string ("dd MMMM yyyy"),
  // not an ISO date, and the underlying theatreMovies are sorted descending
  // by startTime. That means insertion order into the object is
  // newest-first, which we can't rely on staying that way — so we sort the
  // date keys ourselves using the first slot's actual `start` timestamp.
  const dateGroupKeys = Object.keys(datesWithTheatreTimings).sort((a, b) => {
    const aFirst = Object.values(datesWithTheatreTimings[a])[0]?.dates[0]
      ?.start;
    const bFirst = Object.values(datesWithTheatreTimings[b])[0]?.dates[0]
      ?.start;
    if (!aFirst || !bFirst) return 0;
    return new Date(aFirst).getTime() - new Date(bFirst).getTime();
  });

  const hasShowtimes = dateGroupKeys.length > 0;

  // Default to the first (earliest) date once data loads.
  const activeDateKey =
    selectedDateKey && dateGroupKeys.includes(selectedDateKey)
      ? selectedDateKey
      : dateGroupKeys[0];

  const activeTheatres = activeDateKey
    ? datesWithTheatreTimings[activeDateKey]
    : undefined;

  // Sort theatres alphabetically by name for the horizontal list.
  const sortedTheatreEntries = activeTheatres
    ? Object.entries(activeTheatres).sort((a, b) =>
        a[1].theatreData.title.localeCompare(b[1].theatreData.title),
      )
    : [];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />

        {/* Decorative glow */}
        <div className="absolute left-1/2 top-0 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/20 blur-3xl" />

        <div className="relative container mx-auto px-6 py-20">
          <div className="flex flex-col gap-8 md:flex-row md:items-end">
            {/* Poster Placeholder */}
            <div className="h-[420px] w-[280px] rounded-xl border border-white/10 bg-zinc-900 shadow-2xl">
              <div className="flex h-full items-center justify-center text-zinc-600">
                Poster
              </div>
            </div>

            {/* Info */}
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-yellow-400">
                <Star className="h-4 w-4 fill-yellow-400" />
                {movie.rating}/10
              </div>

              <h1 className="mb-4 text-5xl font-bold tracking-tight md:text-7xl">
                {movie.title}
              </h1>

              <p className="mb-8 text-lg leading-relaxed text-zinc-300">
                {movie.description}
              </p>

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
          {/* Showtimes */}
          <div className="mt-0 lg:col-span-3">
            <h2 className="mb-6 text-2xl font-bold">Showtimes</h2>

            {!hasShowtimes ? (
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
                    const firstSlotStart = Object.values(
                      datesWithTheatreTimings[dateKey],
                    )[0]?.dates[0]?.start;
                    if (!firstSlotStart) return null;
                    const { day, date, month } =
                      formatDatePillParts(firstSlotStart);
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
                        <span className="text-[11px] font-semibold uppercase tracking-wide">
                          {day}
                        </span>
                        <span className="text-lg font-bold leading-tight">
                          {date}
                        </span>
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
                    {sortedTheatreEntries.map(
                      ([theatreId, { theatreData, dates }]) => (
                        <div
                          key={theatreId}
                          className="w-full flex md:flex-row flex-col gap-4 shrink-0 rounded-xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur"
                        >
                          <div className="md:min-w-1/3">
                            <p className="font-semibold">{theatreData.title}</p>
                            <p className="flex items-center gap-1.5 text-sm text-zinc-500">
                              <MapPin className="h-3.5 w-3.5" />
                              {theatreData.address}, {theatreData.city},{" "}
                              {theatreData.country}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-3">
                            {dates
                              .slice()
                              .sort(
                                (a, b) =>
                                  new Date(a.start).getTime() -
                                  new Date(b.start).getTime(),
                              )
                              .map((slot, idx) => {
                                const hasId = slot.showId;
                                return (
                                  <>
                                    <button
                                      key={`${theatreId}-${idx}`}
                                      disabled={!hasId}
                                      onClick={() => {
                                        if (!hasId) return;
                                        router.push(
                                          `/movies/${params.movieId}/${slot.showId}`,
                                        );
                                      }}
                                      title={
                                        hasId
                                          ? undefined
                                          : "This showtime is missing an id (backend data issue)"
                                      }
                                      className="flex items-center hover:cursor-pointer gap-1.5 rounded-md border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-white/10 disabled:hover:bg-white/5 disabled:hover:text-inherit"
                                    >
                                      <Clock className="h-3.5 w-3.5" />
                                      {formatTime(slot.start)}
                                      {/* <span className="flex justify-center items-center">
                                        {" — "}
                                      </span> */}
                                      {/* {formatTime(slot.end)} */}
                                    </button>
                                  </>
                                );
                              })}
                          </div>
                        </div>
                      ),
                    )}
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
