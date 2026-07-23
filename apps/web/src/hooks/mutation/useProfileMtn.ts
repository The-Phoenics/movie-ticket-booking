import { env } from "@movie-ticket-booking/env/web";
import type { ServerApiResponseShape, User } from "@movie-ticket-booking/shared/types";
import { useMutation } from "@tanstack/react-query";

export interface CustomerProfile {
  id: string;
  name: string;
}

export interface TheatreProfile {
  id: string;
  title: string;
  address: string;
  city: string;
  country: string;
}

export interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  role: "CUSTOMER" | "BUSINESS";
  isOnboarded: boolean;
  customer: CustomerProfile | null;
  theatre: TheatreProfile | null;
}

export function useProfileMtn(onSuccess: () => void = () => {}) {
  return useMutation({
    mutationKey: ["update-profile"],
    mutationFn: (data: Record<string, string>) => updateUserProfile(data),
    onSuccess: onSuccess,
  });
}

async function updateUserProfile(data: Record<string, string>) {
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res) {
    throw new Error("Network Error");
  }
  const result: ServerApiResponseShape = await res.json();
  if (!result || !result.success) {
    throw new Error("Couldn't update user profile");
  }
  console.log("upd result ", result);
  return result.data;
}
