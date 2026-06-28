"use client";

import { authClient } from "@/lib/auth-client";
import type { Route } from "next";
import { createContext, useContext, type ReactNode } from "react";

type Session = Awaited<ReturnType<typeof authClient.getSession>>["data"];

export const AuthContext = createContext<Session | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, error, isPending, isRefetching } = authClient.useSession();

  if (isPending) return <div className="w-screen h-screen bg-black"></div>;

  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
