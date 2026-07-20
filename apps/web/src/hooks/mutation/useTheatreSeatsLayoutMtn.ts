import type { SeatStatus, TheatreSeat } from "@/app/dashboard/seats/page";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@movie-ticket-booking/env/web";

export function useTheatreSeatsLayoutMtn(theatreId: string, seatStatus: Map<string, SeatStatus>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const seats: TheatreSeat[] = Array.from(seatStatus.entries()).map(([key, status]) => {
        const [row, col] = key.split("::");
        return { row, col: Number(col), status };
      });
      return updateTheatreSeatLayout(theatreId, seats);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theatre-seats"] });
    },
  });
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
