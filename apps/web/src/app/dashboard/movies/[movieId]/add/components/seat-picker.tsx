"use client";

import { cn } from "@/lib/utils";
import type { Seat } from "@movie-ticket-booking/shared/types";

function seatKey(row: string, col: number) {
  return `${row}::${col}`;
}

export function SeatPicker({
  rows,
  maxCols,
  seats,
}: {
  rows: string[];
  maxCols: number;
  seats: Pick<Seat, "row" | "col">[];
}) {
  const existing = new Set(seats.map((s) => seatKey(s.row, s.col)));

  if (rows.length === 0 || maxCols === 0) {
    return (
      <div className="mx-auto max-w-sm py-16 text-center">
        <p className="text-sm font-medium text-zinc-300">No seat layout yet</p>
        <p className="mt-1 text-sm text-zinc-500">Set up your theatre's seat layout before scheduling a show.</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 mr-2 mb-2 flex items-center justify-center gap-5 text-[13px] text-zinc-400">
        <LegendItem label="Available" className="border border-zinc-700" />
        <LegendItem label="Unavailable" className="border border-dashed border-zinc-800" />
      </div>

      <div className="mx-auto flex w-full flex-col items-center gap-2.5 pt-6 pb-4">
        {rows.map((row) => (
          <div key={row} className="flex w-full items-center justify-center gap-3">
            <span className="w-4 shrink-0 text-center text-xs font-semibold text-zinc-500">{row}</span>
            <div className="flex flex-wrap justify-center gap-2">
              {Array.from({ length: maxCols }).map((_, idx) => {
                const col = idx + 1;
                const key = seatKey(row, col);
                const isSeat = existing.has(key);

                if (!isSeat) {
                  return (
                    <span
                      key={key}
                      aria-hidden="true"
                      className="flex h-8 w-8 items-center justify-center rounded-md text-[10px] 
                      border border-dashed border-zinc-800 text-zinc-700 hover:border-zinc-600 hover:text-zinc-500
                      "
                    />
                  );
                }
                return (
                  <button
                    key={key}
                    type="button"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-md text-[10px] font-medium tracking-widest transition-colors duration-150 ease-in hover:cursor-pointer",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                      "border border-zinc-700 text-zinc-300 hover:border-red-500 hover:text-red-400",
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
    </>
  );
}

function LegendItem({ label, className }: { label: string; className: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className={cn("h-3.5 w-3.5 rounded-sm", className)} />
      {label}
    </div>
  );
}
