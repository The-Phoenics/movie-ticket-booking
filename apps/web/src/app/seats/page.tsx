"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { env } from "@movie-ticket-booking/env/web";
import type { Seat, Theatre } from "@movie-ticket-booking/shared/types";
import { cn } from "@/lib/utils";

export async function getTheatreDetails(): Promise<Theatre> {
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/profile`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch theatre.");
  }
  const data = await res.json();
  return data.data.userProfile.theatre;
}

type SeatStatus = "available" | "unavailable";
type TheatreSeat = Pick<Seat, "row" | "col"> & { status: SeatStatus };

export async function getTheatreSeatLayout(
  theatreId: string,
): Promise<Pick<Seat, "row" | "col">[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/owner/${theatreId}/seats`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch seats.");
  }
  const data = await res.json();
  return data.data.theatreSeats;
}

export async function updateTheatreSeatLayout(theatreId: string, seats: TheatreSeat[]) {
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/owner/${theatreId}/seats`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ seats }),
  });

  if (!res.ok) {
    throw new Error("Failed to update seats.");
  }

  return res.json();
}

export function useTheatre() {
  return useQuery({
    queryKey: ["theatre"],
    queryFn: getTheatreDetails,
  });
}

export function useSeats(theatreId?: string) {
  return useQuery({
    queryKey: ["theatre-seats", theatreId],
    queryFn: () => getTheatreSeatLayout(theatreId!),
    enabled: !!theatreId,
  });
}

/** Spreadsheet-style row naming: A, B, ... Z, AA, AB, ... */
function nextRowLabel(rows: string[]): string {
  if (rows.length === 0) return "A";
  const last = rows[rows.length - 1];
  const chars = last.split("");
  let i = chars.length - 1;
  while (i >= 0) {
    if (chars[i] === "Z") {
      chars[i] = "A";
      i--;
    } else {
      chars[i] = String.fromCharCode(chars[i].charCodeAt(0) + 1);
      return chars.join("");
    }
  }
  return "A" + chars.join("");
}

function seatKey(row: string, col: number) {
  return `${row}::${col}`;
}

function ManageSeatsPage() {
  const session = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Locally-editable layout state, seeded from the server data.
  const [rows, setRows] = useState<string[]>([]);
  const [maxCols, setMaxCols] = useState(0);
  const [seatStatus, setSeatStatus] = useState<Map<string, SeatStatus>>(new Map());
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!session) {
      router.replace("/auth" as Route);
    }
  }, [session, router]);

  const theatreQuery = useQuery({
    queryKey: ["theatre"],
    queryFn: getTheatreDetails,
    enabled: !!session,
  });
  const seatsQuery = useSeats(theatreQuery.data?.id);

  // Build the full grid (rows x cols) from the seats the API returned, filling
  // any gap in between with "unavailable". Runs on initial load and again after
  // a successful save invalidates the query.
  useEffect(() => {
    if (!seatsQuery.data) return;
    const rowLabels = Array.from(new Set(seatsQuery.data.map((s) => s.row))).sort();
    const cols = seatsQuery.data.reduce((max, s) => Math.max(max, s.col), 0);
    const present = new Set(seatsQuery.data.map((s) => seatKey(s.row, s.col)));

    const status = new Map<string, SeatStatus>();
    for (const row of rowLabels) {
      for (let col = 1; col <= cols; col++) {
        const key = seatKey(row, col);
        status.set(key, present.has(key) ? "available" : "unavailable");
      }
    }

    setRows(rowLabels);
    setMaxCols(cols);
    setSeatStatus(status);
    setIsDirty(false);
  }, [seatsQuery.data]);

  const updateSeatsMutation = useMutation({
    mutationFn: () => {
      const seats: TheatreSeat[] = Array.from(seatStatus.entries()).map(([key, status]) => {
        const [row, col] = key.split("::");
        return { row, col: Number(col), status };
      });
      return updateTheatreSeatLayout(theatreQuery.data!.id, seats);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theatre-seats"] });
    },
  });

  function toggleSeat(row: string, col: number) {
    setSeatStatus((prev) => {
      const next = new Map(prev);
      const key = seatKey(row, col);
      const current = next.get(key) ?? "unavailable";
      next.set(key, current === "available" ? "unavailable" : "available");
      return next;
    });
    setIsDirty(true);
  }

  function addRow() {
    const label = nextRowLabel(rows);
    setRows((prev) => [...prev, label]);
    setSeatStatus((prev) => {
      const next = new Map(prev);
      for (let c = 1; c <= maxCols; c++) next.set(seatKey(label, c), "unavailable");
      return next;
    });
    setIsDirty(true);
  }

  function addColumn() {
    const newCol = maxCols + 1;
    setMaxCols(newCol);
    setSeatStatus((prev) => {
      const next = new Map(prev);
      for (const row of rows) next.set(seatKey(row, newCol), "unavailable");
      return next;
    });
    setIsDirty(true);
  }

  function discardChanges() {
    if (!seatsQuery.data) return;
    const rowLabels = Array.from(new Set(seatsQuery.data.map((s) => s.row))).sort();
    const cols = seatsQuery.data.reduce((max, s) => Math.max(max, s.col), 0);
    const present = new Set(seatsQuery.data.map((s) => seatKey(s.row, s.col)));

    const status = new Map<string, SeatStatus>();
    for (const row of rowLabels) {
      for (let col = 1; col <= cols; col++) {
        const key = seatKey(row, col);
        status.set(key, present.has(key) ? "available" : "unavailable");
      }
    }

    setRows(rowLabels);
    setMaxCols(cols);
    setSeatStatus(status);
    setIsDirty(false);
  }

  if (!session) return null;

  if (theatreQuery.isPending) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#09090b] text-sm text-zinc-500">
        Loading theatre…
      </div>
    );
  }

  if (theatreQuery.isError) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#09090b] px-6">
        <div className="max-w-sm text-center">
          <p className="text-sm font-medium text-red-400">Couldn't load your theatre</p>
          <p className="mt-1 text-sm text-zinc-500">{theatreQuery.error.message}</p>
        </div>
      </div>
    );
  }

  const totalSeats = Array.from(seatStatus.values()).filter((s) => s === "available").length;
  const totalRows = rows.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#09090b] pb-28 text-[#fafafa] [font-family:var(--body,'Archivo',sans-serif)]">
      <div className="absolute -z-10 inset-0 bg-[linear-gradient(160deg,#18181b_0%,#09090b_60%,#0a0a12_100%)]" />
      <div className="absolute -z-10 -top-30 left-1/2 -translate-x-1/2 w-175 h-100 bg-[radial-gradient(ellipse,rgba(220,38,38,0.16)_0%,transparent_70%)] pointer-events-none" />

      <TheatreDetailsComponent
        theatre={theatreQuery.data}
        totalSeats={totalSeats}
        totalRows={totalRows}
      />

      <div className="w-full px-4 py-6">
        <Screen />

        <div className="mt-8 flex flex-col items-center gap-4">
          <Legend />
          <Toolbar onAddRow={addRow} onAddColumn={addColumn} />
        </div>

        <div className="mt-6">
          {seatsQuery.isPending && (
            <p className="text-center text-sm text-zinc-500">Loading seats…</p>
          )}
          {seatsQuery.isError && (
            <p className="text-center text-sm text-red-400">
              Couldn't load the seat layout. {seatsQuery.error.message}
            </p>
          )}
          {seatsQuery.isSuccess && (
            <SeatsComponent
              rows={rows}
              maxCols={maxCols}
              seatStatus={seatStatus}
              onToggle={toggleSeat}
            />
          )}
        </div>
      </div>

      {isDirty && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-zinc-800 bg-[#0a0a0c]/90 backdrop-blur supports-backdrop-blur:bg-[#0a0a0c]/70">
          <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 px-4 py-3">
            <span className="text-sm text-zinc-400">Unsaved layout changes</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={discardChanges}
                className="rounded-md px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200"
              >
                Discard
              </button>
              <button
                type="button"
                disabled={updateSeatsMutation.isPending}
                onClick={() => {
                  updateSeatsMutation.mutate();
                }}
                className="rounded-md hover:cursor-pointer bg-red-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {updateSeatsMutation.isPending ? "Saving…" : "Save layout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TheatreDetailsComponent({
  theatre,
  totalSeats,
  totalRows,
}: {
  theatre: Theatre;
  totalSeats: number;
  totalRows: number;
}) {
  return (
    <div className="border-b border-zinc-800/80 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <span className="text-[11px] font-medium uppercase tracking-[0.3em] text-red-500/80">
          Manage seats
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">{theatre.title}</h1>
        {theatre.address && <p className="mt-1 text-sm text-zinc-500">{theatre.country}</p>}
        <div className="mt-5 flex gap-6 text-sm">
          <div>
            <span className="block text-lg font-semibold text-zinc-100">{totalRows}</span>
            <span className="text-xs uppercase tracking-wide text-zinc-500">rows</span>
          </div>
          <div>
            <span className="block text-lg font-semibold text-zinc-100">{totalSeats}</span>
            <span className="text-xs uppercase tracking-wide text-zinc-500">available seats</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-2">
      <svg viewBox="0 0 600 60" className="h-10 w-full max-w-md" aria-hidden="true">
        <path
          d="M 10 10 Q 300 55 590 10"
          fill="none"
          stroke="url(#screenGradient)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="screenGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="50%" stopColor="#dc2626" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">screen</span>
    </div>
  );
}

function Legend() {
  const items = [
    { label: "Available", className: "border border-zinc-700" },
    { label: "Unavailable", className: "border border-dashed border-zinc-700" },
  ];
  return (
    <div className="flex items-center gap-5 text-xs text-zinc-400">
      {items.map(({ label, className }) => (
        <div key={label} className="flex items-center gap-2">
          <span className={cn("h-3.5 w-3.5 rounded-sm", className)} />
          {label}
        </div>
      ))}
    </div>
  );
}

function Toolbar({ onAddRow, onAddColumn }: { onAddRow: () => void; onAddColumn: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onAddRow}
        className="rounded-md hover:cursor-pointer border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
      >
        + Add row
      </button>
      <button
        type="button"
        onClick={onAddColumn}
        className="rounded-md hover:cursor-pointer border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
      >
        + Add column
      </button>
    </div>
  );
}

function SeatsComponent({
  rows,
  maxCols,
  seatStatus,
  onToggle,
}: {
  rows: string[];
  maxCols: number;
  seatStatus: Map<string, SeatStatus>;
  onToggle: (row: string, col: number) => void;
}) {
  if (rows.length === 0 || maxCols === 0) {
    return (
      <div className="mx-auto max-w-sm py-16 text-center">
        <p className="text-sm font-medium text-zinc-300">No layout yet</p>
        <p className="mt-1 text-sm text-zinc-500">
          Add a row and a column above to start building the seat map.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-2.5 pt-4 pb-8">
      {rows.map((row) => (
        <div key={row} className="flex w-full items-center justify-center gap-3">
          <span className="w-4 shrink-0 text-center text-xs font-semibold text-zinc-500">
            {row}
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {Array.from({ length: maxCols }).map((_, idx) => {
              const col = idx + 1;
              const status = seatStatus.get(seatKey(row, col)) ?? "unavailable";
              const isAvailable = status === "available";
              return (
                <button
                  key={seatKey(row, col)}
                  type="button"
                  aria-label={
                    isAvailable
                      ? `Seat ${row}${col}, available. Click to mark unavailable.`
                      : `Slot ${row}${col}, unavailable. Click to mark available.`
                  }
                  aria-pressed={isAvailable}
                  onClick={() => onToggle(row, col)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-medium tracking-widest transition-colors duration-150 ease-in hover:cursor-pointer",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                    isAvailable
                      ? "border border-zinc-700 text-zinc-300 hover:border-red-500 hover:text-red-400"
                      : "border border-dashed border-zinc-800 text-zinc-700 hover:border-zinc-600 hover:text-zinc-500",
                  )}
                >
                  {col >= 10 ? String(col) : "0" + String(col)}
                </button>
              );
            })}
          </div>
          <span className="w-4 shrink-0" />
        </div>
      ))}
    </div>
  );
}

export default ManageSeatsPage;
