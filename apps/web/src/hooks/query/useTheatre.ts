import { env } from "@movie-ticket-booking/env/web";
import type { Theatre } from "@movie-ticket-booking/shared/types";
import { useQuery } from "@tanstack/react-query";

interface GetTheatreDetailsResponse {
  userProfile: {
    theatre: Theatre;
  };
}

export function useTheatre(session: any) {
  return useQuery({
    queryKey: ["theatre"],
    queryFn: getTheatreDetails,
    enabled: !!session,
  });
}

export async function getTheatreDetails(): Promise<Theatre> {
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/profile`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Network error.");
  }
  const result = await res.json();
  if (!result.success) {
    throw new Error("Couldn't find theatre details");
  }
  const data: GetTheatreDetailsResponse = result.data;
  console.log(data);
  return data.userProfile.theatre;
}
