import { env } from "@movie-ticket-booking/env/web";
import type { ServerApiResponseShape } from "@movie-ticket-booking/shared/types";
import { useQuery } from "@tanstack/react-query";
import type { ClientSession } from "@/components/providers/auth-provider";

export function useProfile(session: ClientSession | null) {
  return useQuery({
    queryKey: ["get-user-profile"],
    queryFn: getProfile,
    enabled: !!session,
  });
}

async function getProfile() {
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/profile`, { credentials: "include" });
  if (!res) {
    throw new Error("Network error");
  }
  const result: ServerApiResponseShape = await res.json();
  if (!result || !result.success) {
    throw new Error("Couldn't load user profile");
  }
  console.log("result", result)
  return result.data.userProfile;
}
