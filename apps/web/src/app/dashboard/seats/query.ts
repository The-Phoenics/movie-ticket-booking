import { env } from "@movie-ticket-booking/env/web";
import type { Seat, Theatre } from "@movie-ticket-booking/shared/types";
import { useQuery } from "@tanstack/react-query";
import type { TheatreSeat } from "./page";

export function useTheatre(session: any) {
  return useQuery({
    queryKey: ["theatre"],
    queryFn: getTheatreDetails,
    enabled: !!session,
  });
}

export function useTheatreSeatsLayout(theatreId?: string) {
  return useQuery({
    queryKey: ["theatre-seats", theatreId],
    queryFn: () => getTheatreSeatLayout(theatreId!),
    enabled: !!theatreId,
  });
}

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
