"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
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

type TheatreSeat = Pick<Seat, "row" | "col">;

export async function getTheatreSeatLayout(theatreId: string): Promise<TheatreSeat[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/owner/${theatreId}/seats`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch seats.");
  }
  const data = await res.json();
  return data.data.theatreSeats;
}

export async function updateTheatreSeatLayout(theatreId: string) {
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/owner/${theatreId}/seats`, {
    method: "POST",
    credentials: "include",
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

function ManageSeatsPage() {
  const session = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!session) {
      router.replace("/auth" as Route);
    }
  }, [session, router]);

  const theatreQuery = useTheatre();
  const seatsQuery = useSeats(theatreQuery.data?.id);

  const updateSeatsMutation = useMutation({
    mutationFn: updateTheatreSeatLayout,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["theatre-seats"],
      });
    },
  });

  if (theatreQuery.isPending) {
    return <div>Loading theatre...</div>;
  }

  if (theatreQuery.isError) {
    return <div>{theatreQuery.error.message}</div>;
  }

  return (
    <div className="relative overflow-hidden pb-8 min-h-screen bg-[#09090b] text-[#fafafa] [font-family:var(--body,'Archivo',sans-serif)]">
      <div className="absolute -z-1 inset-0 bg-[linear-gradient(160deg,#18181b_0%,#09090b_60%,#0a0a12_100%)]" />
      <div className="absolute -z-1 -top-30 left-1/2 -translate-x-1/2 w-175 h-100 bg-[radial-gradient(ellipse,rgba(220,38,38,0.18)_0%,transparent_70%)] pointer-events-none" />
      <TheatreDetailsComponent theatre={theatreQuery.data} />

      <div className="w-full py-4 pt-8">
        {/* Screen indicator */}
        <div className="w-full flex justify-center items-center mb-4">
          <div className="flex w-full max-w-2xl flex-col justify-center items-center gap-2">
            <div className="h-1.5 w-full rounded-full bg-linear-to-r from-transparent via-red-600/70 to-transparent shadow-[0_0_24px_4px_rgba(220,38,38,0.35)]" />
            <span className="text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
              screen
            </span>
          </div>
        </div>
        {seatsQuery.isPending && <p>Loading seats...</p>}
        {seatsQuery.isError ? (
          <div>Failed to fetch seats</div>
        ) : (
          seatsQuery.data && <SeatsComponent seats={seatsQuery.data} />
        )}
      </div>
    </div>
  );
}

function TheatreDetailsComponent({ theatre }: { theatre: Theatre }) {
  console.log(theatre);
  return <div className="w-full border h-52">Theatre Details</div>;
}

function SeatsComponent({ seats }: { seats: TheatreSeat[] }) {
  const rows = useMemo(() => {
    const grouped = new Map<string, TheatreSeat[]>();
    for (const seat of seats) {
      const rowKey = seat.row;
      if (!grouped.has(rowKey)) grouped.set(rowKey, []);
      grouped.get(rowKey)!.push(seat);
    }
    return Array.from(grouped.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, rowSeats]) => ({
        row,
        seats: rowSeats.sort((a, b) => a.col - b.col),
      }));
  }, [seats]);

  return (
    <div className="w-full h-full flex justify-center items-center">
      {/* Grid */}
      <div className="md:w-1/2 w-full flex flex-col gap-2.5v justify-center items-center pt-8 pb-5">
        {rows.length == 0 && <i className="text-sm text-gray-600">{"No seats available."}</i>}
        {rows.map(({ row, seats: rowSeats }) => (
          <div key={row} className="flex items-center justify-between gap-3 mb-3 w-full">
            <span className="w-4 text-center text-xs font-semibold text-zinc-500">{row}</span>
            <div className="flex gap-2">
              {Array.from({ length: rowSeats.length }).map((_, idx) => {
                const seat = rowSeats.find((seat) => seat.col === idx + 1);
                return (
                  <button
                    key={`${row}-${idx + 1}`}
                    type="button"
                    aria-label={`Seat ${row}${idx + 1}`}
                    onClick={() => {}}
                    className={cn(
                      "flex justify-center items-center h-8 w-8 rounded-md inset-shadow-white tracking-widest text-xl hover:shadow-xs hover:shadow-[#9f9f9f] transition-colors duration-150 ease-in border text-[10px] font-medium",
                      "focus-visible:outline-none focus-visible:ring-2 hover:cursor-pointer focus-visible:ring-red-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
                      seat === undefined && "invisible",
                    )}
                  >
                    {seat && (seat.col >= 10 ? String(seat.col) : "0" + String(seat.col))}
                  </button>
                );
              })}
            </div>
            <div />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageSeatsPage;
