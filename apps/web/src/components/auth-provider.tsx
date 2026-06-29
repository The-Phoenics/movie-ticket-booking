"use client";

import { authClient } from "@/lib/auth-client";
import type { Route } from "next";
import { createContext, useContext, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

type Session = Awaited<ReturnType<typeof authClient.getSession>>["data"];

export const AuthContext = createContext<Session | undefined>(undefined);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="min-h-screen w-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-700" />
      </div>
    );
  }

  return <AuthContext.Provider value={session}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
