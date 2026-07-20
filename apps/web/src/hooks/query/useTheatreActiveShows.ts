import { env } from "@movie-ticket-booking/env/web";
import type { Movie, Show } from "@movie-ticket-booking/shared/types";
import { useQuery } from "@tanstack/react-query";

export interface TheatreActiveShowsResponse {
  data: {
    movie: Movie,
    shows: Show[]
  }[]
}

async function getActiveShows(theatreId: string) {
  try {
    const url = `${env.NEXT_PUBLIC_SERVER_URL}/owner/${theatreId}/shows`;
    const res = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Network error");
    }
    return res.json();
  } catch (err) {
    throw new Error("Failed to fetch theatre active shows");
  }
}

export function useTheatreActiveShows(theatreId?: string) {
  return useQuery({
    queryKey: ["get-theatre-active-shows", theatreId],
    queryFn: () => getActiveShows(theatreId!),
    enabled: !!theatreId,
    select: (res: TheatreActiveShowsResponse) => res.data,
  });
}
