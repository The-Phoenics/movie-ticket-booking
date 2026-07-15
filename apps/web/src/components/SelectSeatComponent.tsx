import { cn } from "@/lib/utils";
import { useMemo } from "react";

type SeatStatus = "AVAILABLE" | "SOLD";

interface TheatreMovieSeatDto {
  id: string;
  showId: string;
  seatId: string;
  status: SeatStatus;
  price: number;
  seat: {
    id: string;
    row: string;
    col: number;
  };
}

interface SeatMapProps {
  seats: TheatreMovieSeatDto[];
  selectedSeatId: string | null;
  onSelectSeat: (seat: TheatreMovieSeatDto) => void;
}

export default function SelectTheatreMovieSeat({
  seats,
  selectedSeatId,
  onSelectSeat,
}: SeatMapProps) {
  const rows = useMemo(() => {
    const grouped = new Map<string, TheatreMovieSeatDto[]>();
    for (const seat of seats) {
      const rowKey = seat.seat.row;
      if (!grouped.has(rowKey)) grouped.set(rowKey, []);
      grouped.get(rowKey)!.push(seat);
    }
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, rowSeats]) => ({
        row,
        seats: rowSeats.sort((a, b) => a.seat.col - b.seat.col),
      }));
  }, [seats]);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      {/* Screen indicator */}
      <div className="flex w-full max-w-2xl flex-col items-center gap-2">
        <div className="h-1.5 w-full rounded-full bg-linear-to-r from-transparent via-red-600/70 to-transparent shadow-[0_0_24px_4px_rgba(220,38,38,0.35)]" />
        <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">screen</span>
      </div>

      {/* Grid */}
      <div className="flex flex-col gap-2.5">
        {rows.length == 0 && <i className="text-sm text-gray-600">{"No seats available."}</i>}
        {rows.map(({ row, seats: rowSeats }) => (
          <div key={row} className="flex items-center gap-3">
            <span className="w-4 text-center text-xs font-semibold text-zinc-500">{row}</span>
            <div className="flex gap-2">
              {rowSeats.map((seat) => {
                const isSold = seat.status === "SOLD";
                const isSelected = seat.id === selectedSeatId;

                return (
                  <button
                    key={seat.id}
                    type="button"
                    disabled={isSold}
                    aria-label={`Seat ${row}${seat.seat.col}, ${
                      isSold ? "sold" : isSelected ? "selected" : "available"
                    }`}
                    aria-pressed={isSelected}
                    onClick={() => onSelectSeat(seat)}
                    className={cn(
                      "h-7 w-7 rounded-md border text-[10px] font-medium transition-colors",
                      "focus-visible:outline-none focus-visible:ring-2 hover:cursor-pointer focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                      isSold && "cursor-not-allowed border-zinc-800 bg-zinc-900 text-zinc-700",
                      !isSold &&
                        !isSelected &&
                        "border-zinc-600 bg-zinc-700 text-zinc-300 hover:bg-zinc-600",
                      isSelected && "border-red-500 bg-red-600 text-white",
                    )}
                  >
                    {seat.seat.col}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-xs text-zinc-500">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-zinc-600 bg-zinc-700" />
          Available
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-red-500 bg-red-600" />
          Selected
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-sm border border-zinc-800 bg-zinc-900" />
          Sold
        </div>
      </div>
    </div>
  );
}
