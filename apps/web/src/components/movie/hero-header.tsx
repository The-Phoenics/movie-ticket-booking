"use client";

import { Flame } from "lucide-react";
import SearchBar from "@/components/search-bar";
import type { Dispatch, SetStateAction } from "react";

export function HeroHeader({
  search,
  setSearch,
  showRegion,
}: {
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
  showRegion: boolean;
}) {
  return (
    <header className="w-full relative pb-8 pt-6">
      <div className="w-full absolute inset-0 bg-[linear-gradient(160deg,#18181b_0%,#09090b_60%,#0a0a12_100%)]" />
      <div className="absolute -top-30 left-1/2 -translate-x-1/2 w-175 h-100 bg-[radial-gradient(ellipse,rgba(220,38,38,0.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="mb-8">
          {showRegion && (
            <div className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-[#dc2626] tracking-[0.08em] uppercase mb-3">
              <Flame size={14} />
              Now Showing · Delhi NCR
            </div>
          )}
          <h1 className="[font-family:var(--display,'Fraunces',serif)] text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.1] text-[#fafafa] mb-3 tracking-[-0.03em]">
            Latest <em className="italic text-[#fca5a5]">Movies</em>
          </h1>
          <p className="text-base text-white/45 leading-[1.6] max-w-130 m-0">
            Browse every film in theaters, hold your seats in seconds, and walk in with the ticket in hand.
          </p>
        </div>

        <SearchBar search={search} setSearch={setSearch} />
      </div>
    </header>
  );
}
