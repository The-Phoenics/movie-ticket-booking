"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, Building2, ChevronDown, Film } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useState, useRef, useEffect } from "react";
import type { Route } from "next";

export default function UserMenu() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  if (isPending) {
    return <div className="h-9 w-9 rounded-xl bg-zinc-800 animate-pulse" />;
  }

  if (!session) {
    return (
      <Link
        href={"/auth" as Route}
        className="rounded-xl border border-zinc-700 bg-zinc-800/60 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-zinc-600 hover:text-zinc-100"
      >
        Sign In
      </Link>
    );
  }

  const user = session.user;
  const isCustomer = (user as { role?: string }).role === "CUSTOMER";
  const displayName = user.name ?? user.email;
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleSignOut = () => {
    setOpen(false);
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => router.push("/auth" as Route),
      },
    });
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-sm transition hover:border-zinc-600 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-red-500/30"
      >
        {/* Avatar */}
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-red-600/20 text-xs font-bold text-red-400 select-none">
          {initials}
        </span>
        <span className="max-w-[120px] truncate text-zinc-300 font-medium hidden sm:block">
          {displayName}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-zinc-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl shadow-black/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-100">
          {/* User info header */}
          <div className="px-4 py-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-600/15 text-sm font-bold text-red-400 select-none">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-100 truncate">{displayName}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>
            <span
              className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
                isCustomer ? "bg-red-600/15 text-red-400" : "bg-orange-600/15 text-orange-400"
              }`}
            >
              {isCustomer ? <User className="h-3 w-3" /> : <Building2 className="h-3 w-3" />}
              {isCustomer ? "Movie-Goer" : "Theatre Owner"}
            </span>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href={"/profile" as Route}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
            >
              <User className="h-4 w-4 text-zinc-500" />
              View Profile
            </Link>
            <Link
              href={"/movies" as Route}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
            >
              <Film className="h-4 w-4 text-zinc-500" />
              Browse Movies
            </Link>
          </div>

          <div className="border-t border-zinc-800 py-1">
            <button
              type="button"
              onClick={handleSignOut}
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 transition hover:bg-red-600/10 hover:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
