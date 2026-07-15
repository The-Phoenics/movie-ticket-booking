"use client";

import { useAuth } from "@/components/auth-provider";
import type { Seat, Theatre } from "@movie-ticket-booking/shared/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import type { Route } from "next";
import { useEffect, useMemo, useState } from "react";
import { addMovieShowToTheatre, useMovie } from "./query";
import { MovieSummary } from "@/components/movie-details";
import { ShowtimeForm, type ShowtimeFormValues } from "./components/show-time-form";
import { SeatPicker } from "./components/seat-picker";
import { toast } from "sonner";
import { isValidDate } from "@/lib/utils";
import { set } from "date-fns";
import { useTheatre, useTheatreSeatsLayout } from "@/app/dashboard/seats/query";

function seatKey(row: string, col: number) {
  return `${row}::${col}`;
}

export default function AddMovieToTheatrePage() {
  const session = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const params = useParams<{ movieId: string }>();
  const movieId = params.movieId;

  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [seats, setSeats] = useState<Pick<Seat, "row" | "col">[]>([]);
  const [showtime, setShowtime] = useState<ShowtimeFormValues>({
    date: "",
    time: "",
    price: "",
  });

  const movieQuery = useMovie(movieId);
  const theatreQuery = useTheatre(session);
  const theatreSeatsLayout = useTheatreSeatsLayout(theatre?.id);

  useEffect(() => {
    if (!session) {
      router.replace("/auth" as Route);
    }
  }, [session, router]);

  useEffect(() => {
    const fetchedTheatre = theatreQuery.data ?? null;
    setTheatre(fetchedTheatre);
  }, [theatreQuery.data]);

  useEffect(() => {
    const fetchedMovie = movieQuery.data;
    console.log("fetched movie:", fetchedMovie);
  }, [movieQuery.data]);

  useEffect(() => {
    const fetchedTheatreSeats = theatreSeatsLayout.data ?? [];
    setSeats(fetchedTheatreSeats);
  }, [theatreSeatsLayout.data]);

  const rows = useMemo(() => Array.from(new Set(seats.map((s) => s.row))).sort(), [seats]);
  const maxCols = useMemo(() => seats.reduce((max, s) => Math.max(max, s.col), 0), [seats]);

  const addShowtimeMutation = useMutation({
    mutationFn: () => {
      if (!theatre) throw new Error("No theatre selected");
      let showDateTime = new Date(showtime.date);
      if (!isValidDate(showDateTime)) {
        throw Error("Invalid date");
      }
      const startTimeString = showtime.time.split(":");
      const hoursStr = startTimeString[0];
      const minutesStr = startTimeString[1];
      const hours = Number(hoursStr);
      const minutes = Number(minutesStr);

      if (isNaN(hours) || hours > 24 || isNaN(minutes) || minutes > 60) {
        throw Error("Invalid time");
      }

      showDateTime = set(showDateTime, {
        hours: hours,
        minutes: minutes,
      });
      return addMovieShowToTheatre(theatre.id, movieId, {
        time: showDateTime,
        price: Number(showtime.price),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theatre-showtimes"] });
    },
    onError: (error: { error: { message?: string } }) => {
      console.log("err:", error.error.message);
      toast.error(error.error.message || "Failed to add movie to theatre.");
    },
  });

  const isFormValid = showtime.date.length > 0 && showtime.time.length > 0 && Number(showtime.price) > 0;

  if (!session) return null;

  if (movieQuery.isPending || theatreQuery.isPending) {
    return <div className="grid min-h-screen place-items-center bg-[#09090b] text-sm text-zinc-500">Loading…</div>;
  }

  if (movieQuery.isError) {
    return <PageError title="Couldn't load movie" message={movieQuery.error.message} />;
  }

  if (theatreQuery.isError) {
    return <PageError title="Couldn't load your theatre" message={theatreQuery.error.message} />;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] pb-28 text-[#fafafa] [font-family:var(--body,'Archivo',sans-serif)]">
      <div className="absolute -z-10 inset-0 bg-[linear-gradient(160deg,#18181b_0%,#09090b_60%,#0a0a12_100%)]" />
      <div className="absolute -z-10 -top-30 left-1/2 -translate-x-1/2 w-175 h-100 bg-[radial-gradient(ellipse,rgba(220,38,38,0.16)_0%,transparent_70%)] pointer-events-none" />

      <div className="border-b border-zinc-800/80 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-red-500/80">
            Add to {theatre?.title ?? "theatre"}
          </span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">Schedule a showtime</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Set the date, time and price, then choose which seats are open for this show.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full flex justify-center items-center flex-col">
        <MovieSummary movie={movieQuery.data.data} />

        <div className="mt-8 max-w-2xl">
          <div className="flex items-center justify-center gap-3">
            <h2 className="text-sm mb-2 font-semibold uppercase tracking-wide text-zinc-300">{"Showtime details"}</h2>
          </div>
          <ShowtimeForm value={showtime} onChange={setShowtime} />
        </div>

        <div className="mt-10 w-full">
          {theatreSeatsLayout.isPending && (
            <p className="mt-4 text-center text-sm text-zinc-500">Loading seat layout…</p>
          )}
          {theatreSeatsLayout.isError && (
            <p className="mt-4 text-center text-sm text-red-400">
              Couldn't load the seat layout. {theatreSeatsLayout.error.message}
            </p>
          )}
          {theatreSeatsLayout.isSuccess && <SeatPicker rows={rows} maxCols={maxCols} seats={seats} />}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-800 bg-[#0a0a0c]/90 backdrop-blur supports-backdrop-blur:bg-[#0a0a0c]/70">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm text-zinc-400">
            {seats.length} seat{seats.length === 1 ? "" : "s"} available
          </span>
          <button
            type="button"
            disabled={!isFormValid || addShowtimeMutation.isPending}
            onClick={() => addShowtimeMutation.mutate()}
            className="rounded-md hover:cursor-pointer bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {addShowtimeMutation.isPending ? "Adding…" : "Add Show"}
          </button>
        </div>
      </div>
    </div>
  );
}

function PageError({ title, message }: { title: string; message: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-[#09090b] px-6">
      <div className="max-w-sm text-center">
        <p className="text-sm font-medium text-red-400">{title}</p>
        <p className="mt-1 text-sm text-zinc-500">{message}</p>
      </div>
    </div>
  );
}
