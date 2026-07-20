import { env } from "@movie-ticket-booking/env/web";
import type { Seat } from "@movie-ticket-booking/shared/types";
import { useQuery } from "@tanstack/react-query";

export function useTheatreSeatsLayout(theatreId?: string) {
  return useQuery({
    queryKey: ["theatre-seats", theatreId],
    queryFn: () => getTheatreSeatLayout(theatreId!),
    enabled: !!theatreId,
  });
}

export async function getTheatreSeatLayout(theatreId: string): Promise<Pick<Seat, "row" | "col">[]> {
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/owner/${theatreId}/seats`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch seats.");
  }
  const data = await res.json();
  return data.data.theatreSeats;
}
