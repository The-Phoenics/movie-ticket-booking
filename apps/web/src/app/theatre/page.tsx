"use client";

import { useAuth } from "@/components/auth-provider";
import UserMenu from "@/components/user-menu";
import { env } from "@movie-ticket-booking/env/web";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Clapperboard,
  MapPin,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
  Loader2,
  Armchair,
  CalendarPlus,
  ShieldAlert,
} from "lucide-react";
import { useMemo, useState } from "react";

interface TheatreInfo {
  id: string;
  title: string;
  address: string;
  city: string;
  country: string;
}

interface ShowWithMovie {
  id: string; // Show.id
  movieId: string;
  movieTitle: string;
  startTime: string; // ISO
  endTime: string; // ISO
}

interface SeatRow {
  id: string; // Seat.id
  row: string;
  col: number;
}

interface TheatreDashboardResponse {
  data: {
    theatre: TheatreInfo;
    shows: ShowWithMovie[];
    seats: SeatRow[];
  };
}

// Slim movie shape just for the "add to theatre" picker.
interface CatalogMovie {
  id: string;
  title: string;
}

interface MoviesCatalogResponse {
  data: {
    movies: CatalogMovie[];
  };
}

function formatDateHeading(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function groupShowsByDate(shows: ShowWithMovie[]) {
  const groups = new Map<string, ShowWithMovie[]>();
  for (const show of shows) {
    const key = new Date(show.startTime).toDateString();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(show);
  }
  return Array.from(groups.entries())
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .map(([key, list]) => ({
      key,
      shows: list.slice().sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()),
    }));
}

function sortSeats(seats: SeatRow[]) {
  return seats
    .slice()
    .sort((a, b) => (a.row === b.row ? a.col - b.col : a.row.localeCompare(b.row)));
}

function AddShowForm({
  movies,
  onSubmit,
  isSubmitting,
}: {
  movies: CatalogMovie[];
  onSubmit: (input: { movieId: string; startTime: string; endTime: string }) => void;
  isSubmitting: boolean;
}) {
  const [movieId, setMovieId] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const canSubmit = movieId && date && startTime && endTime;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({
          movieId,
          startTime: new Date(`${date}T${startTime}`).toISOString(),
          endTime: new Date(`${date}T${endTime}`).toISOString(),
        });
        setMovieId("");
        setDate("");
        setStartTime("");
        setEndTime("");
      }}
      className="grid grid-cols-1 gap-3 rounded-xl border border-white/10 bg-zinc-900/50 p-5 sm:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_auto]"
    >
      <select
        value={movieId}
        onChange={(e) => setMovieId(e.target.value)}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-red-500/50 focus:outline-none"
      >
        <option value="" disabled>
          Select a movie
        </option>
        {movies.map((m) => (
          <option key={m.id} value={m.id} className="bg-zinc-900">
            {m.title}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-red-500/50 focus:outline-none"
      />

      <input
        type="time"
        value={startTime}
        onChange={(e) => setStartTime(e.target.value)}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-red-500/50 focus:outline-none"
      />

      <input
        type="time"
        value={endTime}
        onChange={(e) => setEndTime(e.target.value)}
        className="rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-red-500/50 focus:outline-none"
      />

      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="flex items-center justify-center gap-1.5 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CalendarPlus className="h-4 w-4" />}
        Add
      </button>
    </form>
  );
}

function SeatItem({
  seat,
  onUpdate,
  onDelete,
  isBusy,
}: {
  seat: SeatRow;
  onUpdate: (id: string, input: { row: string; col: number }) => void;
  onDelete: (id: string) => void;
  isBusy: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [row, setRow] = useState(seat.row);
  const [col, setCol] = useState(seat.col);

  if (editing) {
    return (
      <div className="flex items-center gap-2 rounded-md border border-red-500/40 bg-red-500/5 px-3 py-2">
        <input
          value={row}
          onChange={(e) => setRow(e.target.value.toUpperCase().slice(0, 2))}
          className="w-12 rounded border border-white/10 bg-white/5 px-2 py-1 text-center text-sm uppercase text-white focus:border-red-500/50 focus:outline-none"
        />
        <input
          type="number"
          value={col}
          onChange={(e) => setCol(Number(e.target.value))}
          className="w-16 rounded border border-white/10 bg-white/5 px-2 py-1 text-center text-sm text-white focus:border-red-500/50 focus:outline-none"
        />
        <button
          onClick={() => {
            onUpdate(seat.id, { row, col });
            setEditing(false);
          }}
          disabled={isBusy}
          className="rounded p-1 text-emerald-400 hover:bg-emerald-500/10"
          aria-label="Save seat"
        >
          <Check className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => {
            setRow(seat.row);
            setCol(seat.col);
            setEditing(false);
          }}
          className="rounded p-1 text-zinc-400 hover:bg-white/10"
          aria-label="Cancel edit"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm">
      <Armchair className="h-3.5 w-3.5 text-zinc-500" />
      <span className="font-medium">
        {seat.row}
        {seat.col}
      </span>
      <button
        onClick={() => setEditing(true)}
        className="ml-1 rounded p-1 text-zinc-400 hover:bg-white/10 hover:text-white"
        aria-label="Edit seat"
      >
        <Pencil className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={() => onDelete(seat.id)}
        disabled={isBusy}
        className="rounded p-1 text-zinc-400 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
        aria-label="Delete seat"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export default function TheatreDashboardPage() {
  // ASSUMPTION: useAuth() exposes the Better Auth session with a typed
  // `role` field (per your AuthenticatedRequest pattern on the backend).
  // Adjust the property path below to match the real shape.
  const auth = useAuth() as { user?: { role?: string }; isPending?: boolean } | null;
  const isOwner = auth?.user?.role === "OWNER";

  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"shows" | "seats">("shows");
  const [newSeatRow, setNewSeatRow] = useState("");
  const [newSeatCol, setNewSeatCol] = useState("");

  const { data, isPending, error } = useQuery<TheatreDashboardResponse>({
    queryKey: ["theatreDashboard"],
    // ASSUMPTION: GET /theatre/me returns the signed-in owner's theatre,
    // its scheduled shows (joined with movie title), and its seat map.
    queryFn: () =>
      fetch(env.NEXT_PUBLIC_SERVER_URL + "/theatre/me", { credentials: "include" }).then((res) =>
        res.json(),
      ),
    enabled: isOwner,
  });

  const { data: catalogData } = useQuery<MoviesCatalogResponse>({
    queryKey: ["moviesData"],
    queryFn: () => fetch(env.NEXT_PUBLIC_SERVER_URL + "/movies").then((res) => res.json()),
    enabled: isOwner,
  });

  const theatre = data?.data?.theatre;
  const shows = data?.data?.shows ?? [];
  const seats = data?.data?.seats ?? [];
  const movies = catalogData?.data?.movies ?? [];

  const groupedShows = useMemo(() => groupShowsByDate(shows), [shows]);
  const sortedSeats = useMemo(() => sortSeats(seats), [seats]);

  // ── Mutations ──
  // ASSUMPTION: REST endpoints follow the same router → controller → service
  // layering as the rest of the backend. Swap paths/payloads to match once
  // the real routes exist.

  const addShow = useMutation({
    mutationFn: (input: { movieId: string; startTime: string; endTime: string }) =>
      fetch(env.NEXT_PUBLIC_SERVER_URL + "/theatre/shows", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["theatreDashboard"] }),
  });

  const removeShow = useMutation({
    mutationFn: (showId: string) =>
      fetch(env.NEXT_PUBLIC_SERVER_URL + `/theatre/shows/${showId}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["theatreDashboard"] }),
  });

  const addSeat = useMutation({
    mutationFn: (input: { row: string; col: number }) =>
      fetch(env.NEXT_PUBLIC_SERVER_URL + "/theatre/seats", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["theatreDashboard"] }),
  });

  const updateSeat = useMutation({
    mutationFn: ({ id, input }: { id: string; input: { row: string; col: number } }) =>
      fetch(env.NEXT_PUBLIC_SERVER_URL + `/theatre/seats/${id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["theatreDashboard"] }),
  });

  const deleteSeat = useMutation({
    mutationFn: (id: string) =>
      fetch(env.NEXT_PUBLIC_SERVER_URL + `/theatre/seats/${id}`, {
        method: "DELETE",
        credentials: "include",
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["theatreDashboard"] }),
  });

  // ── Access control ──
  if (auth?.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-black px-6 text-center text-white">
        <ShieldAlert className="h-10 w-10 text-red-500" />
        <h1 className="text-2xl font-semibold">Owners only</h1>
        <p className="max-w-sm text-sm text-zinc-500">
          This dashboard is only available to theatre-owner accounts.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Header ── */}
      <header className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
        <div className="absolute left-1/2 top-0 h-[300px] w-[600px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />

        <div className="relative container mx-auto flex items-center justify-between px-6 py-6">
          <span className="text-xl font-semibold tracking-tight">
            Mtb<span className="text-red-600">.</span>
          </span>
          <UserMenu />
        </div>

        <div className="relative container mx-auto px-6 pb-10">
          {isPending || !theatre ? (
            <div className="animate-pulse space-y-3">
              <div className="h-9 w-72 rounded bg-white/10" />
              <div className="h-5 w-48 rounded bg-white/10" />
            </div>
          ) : (
            <>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-red-500">
                Owner Dashboard
              </p>
              <h1 className="mb-2 text-4xl font-bold tracking-tight">{theatre.title}</h1>
              <p className="flex items-center gap-1.5 text-sm text-zinc-400">
                <MapPin className="h-3.5 w-3.5" />
                {theatre.address}, {theatre.city}, {theatre.country}
              </p>
            </>
          )}
        </div>
      </header>

      {error && (
        <div className="container mx-auto px-6 pt-8">
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            Couldn&apos;t load your theatre. Please refresh or try again shortly.
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="container mx-auto px-6 pt-8">
        <div className="flex w-fit gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
          <button
            onClick={() => setTab("shows")}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === "shows" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Clapperboard className="h-4 w-4" />
            Movies & Showtimes
          </button>
          <button
            onClick={() => setTab("seats")}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${
              tab === "seats" ? "bg-red-600 text-white" : "text-zinc-400 hover:text-white"
            }`}
          >
            <Armchair className="h-4 w-4" />
            Seats
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="container mx-auto px-6 py-8">
        {tab === "shows" && (
          <div className="space-y-8">
            <AddShowForm
              movies={movies}
              onSubmit={(input) => addShow.mutate(input)}
              isSubmitting={addShow.isPending}
            />

            {groupedShows.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-8 text-center text-zinc-500">
                No movies added to this theatre yet — use the form above to schedule one.
              </div>
            ) : (
              <div className="space-y-8">
                {groupedShows.map(({ key, shows: dayShows }) => (
                  <div key={key}>
                    <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
                      {formatDateHeading(dayShows[0].startTime)}
                    </h3>
                    <div className="space-y-2">
                      {dayShows.map((show) => (
                        <div
                          key={show.id}
                          className="flex items-center justify-between rounded-lg border border-white/10 bg-zinc-900/50 px-4 py-3"
                        >
                          <div>
                            <p className="font-medium">{show.movieTitle}</p>
                            <p className="text-sm text-zinc-500">
                              {formatTime(show.startTime)} — {formatTime(show.endTime)}
                            </p>
                          </div>
                          <button
                            onClick={() => removeShow.mutate(show.id)}
                            disabled={removeShow.isPending}
                            className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "seats" && (
          <div className="space-y-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!newSeatRow || !newSeatCol) return;
                addSeat.mutate({ row: newSeatRow.toUpperCase(), col: Number(newSeatCol) });
                setNewSeatRow("");
                setNewSeatCol("");
              }}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-white/10 bg-zinc-900/50 p-5"
            >
              <input
                placeholder="Row (e.g. A)"
                value={newSeatRow}
                onChange={(e) => setNewSeatRow(e.target.value.toUpperCase().slice(0, 2))}
                className="w-32 rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm uppercase text-white focus:border-red-500/50 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Seat number"
                value={newSeatCol}
                onChange={(e) => setNewSeatCol(e.target.value)}
                className="w-36 rounded-md border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-red-500/50 focus:outline-none"
              />
              <button
                type="submit"
                disabled={addSeat.isPending}
                className="flex items-center gap-1.5 rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-40"
              >
                {addSeat.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Add seat
              </button>
            </form>

            {sortedSeats.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-8 text-center text-zinc-500">
                No seats configured yet — add your first seat above.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 rounded-xl border border-white/10 bg-zinc-900/50 p-5">
                {sortedSeats.map((seat) => (
                  <SeatItem
                    key={seat.id}
                    seat={seat}
                    onUpdate={(id, input) => updateSeat.mutate({ id, input })}
                    onDelete={(id) => deleteSeat.mutate(id)}
                    isBusy={updateSeat.isPending || deleteSeat.isPending}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}