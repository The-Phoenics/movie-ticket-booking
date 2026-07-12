"use client";

import { useAuth } from "@/components/auth-provider";
import MovieCard, { MovieCardSkeleton } from "@/components/movie-card";
import UserMenu from "@/components/user-menu";
import { env } from "@movie-ticket-booking/env/web";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, X, Clapperboard, Flame, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

function useDebounce<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

interface Movie {
  id: string;
  title: string;
  description: string;
  rating: number;
  crew: Record<string, string>;
  genres?: string[];
  duration?: string;
  language?: string;
  releaseDate?: string;
}

interface MoviesResponse {
  data: {
    movies: Movie[];
  };
}

// Assign a deterministic "gradient" to each movie card based on index
const POSTER_GRADIENTS = [
  "from-red-900 via-red-800 to-orange-900",
  "from-violet-900 via-purple-800 to-indigo-900",
  "from-blue-900 via-cyan-800 to-teal-900",
  "from-emerald-900 via-green-800 to-teal-900",
  "from-amber-900 via-orange-800 to-red-900",
  "from-pink-900 via-rose-800 to-red-900",
  "from-indigo-900 via-blue-800 to-cyan-900",
  "from-slate-800 via-zinc-700 to-stone-800",
];

const ACCENT_COLORS = [
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ec4899",
  "#6366f1",
  "#94a3b8",
];

// Fallback genres for movies that don't have them from the API
const FALLBACK_GENRES = [
  ["Thriller", "Mystery"],
  ["Drama", "Romance"],
  ["Action", "Adventure"],
  ["Comedy", "Family"],
  ["Sci-Fi", "Fantasy"],
  ["Horror", "Suspense"],
  ["Biography", "Historical"],
  ["Animation", "Kids"],
];

const ALL_GENRES = [
  "Action",
  "Drama",
  "Thriller",
  "Comedy",
  "Romance",
  "Horror",
  "Sci-Fi",
  "Adventure",
  "Mystery",
  "Biography",
  "Animation",
  "Fantasy",
];

const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "title", label: "A–Z" },
  { value: "newest", label: "Newest First" },
];

export default function MoviesPage() {
  const user = useAuth();
  const userRole = user?.user.role
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce the raw input so the API is only called after the user pauses.
  // Falls back to "spider" as the hardcoded initial search when the box is empty.
  const debouncedSearch = useDebounce(search, 350);
  const searchString = debouncedSearch.trim() || "spider";

  const { isPending, error, data } = useQuery<MoviesResponse>({
    queryKey: ["moviesData", searchString], // keyed on debounced value
    queryFn: async () => {
      const res = await fetch(
        env.NEXT_PUBLIC_SERVER_URL + `/movies/search?searchString=${encodeURIComponent(searchString)}`,
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      return res.json();
    },
  });

  const movies = data?.data.movies ?? null;

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] [font-family:var(--body,'Archivo',sans-serif)]">
      {/* ── Header / Hero ── */}
      <header className="relative overflow-hidden pb-8">
        <div className="absolute inset-0 bg-[linear-gradient(160deg,#18181b_0%,#09090b_60%,#0a0a12_100%)]" />
        <div className="absolute -top-[120px] left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,rgba(220,38,38,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="relative max-w-[1280px] mx-auto px-6">
          {/* Brand row */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-10 pt-5 pb-8 border-b border-white/[0.06] mb-10">
            <Link
              href="/"
              className="[font-family:var(--display,'Fraunces',serif)] text-2xl font-semibold text-[#fafafa] no-underline tracking-[-0.02em] whitespace-nowrap"
            >
              Mtb<span className="text-[#dc2626]">.</span>
            </Link>
            <nav className="flex gap-0 sm:gap-1">
              <a className="px-2.5 sm:px-3.5 py-[0.4rem] rounded-full text-[0.8125rem] sm:text-sm cursor-pointer transition-colors duration-150 no-underline text-[#fafafa] bg-[#dc2626]/15">
                Now Showing
              </a>
              <a className="px-2.5 sm:px-3.5 py-[0.4rem] rounded-full text-[0.8125rem] sm:text-sm text-white/55 cursor-pointer transition-colors duration-150 no-underline hover:text-white/90 hover:bg-white/[0.06]">
                Coming Soon
              </a>
              <a className="px-2.5 sm:px-3.5 py-[0.4rem] rounded-full text-[0.8125rem] sm:text-sm text-white/55 cursor-pointer transition-colors duration-150 no-underline hover:text-white/90 hover:bg-white/[0.06]">
                Events
              </a>
            </nav>
            <div style={{ marginLeft: "auto" }}>
              <UserMenu />
            </div>
          </div>

          {/* Hero copy */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 text-[0.8125rem] font-medium text-[#dc2626] tracking-[0.08em] uppercase mb-3">
              <Flame size={14} />
              Now Showing · Delhi NCR
            </div>
            <h1 className="[font-family:var(--display,'Fraunces',serif)] text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.1] text-[#fafafa] mb-3 tracking-[-0.03em]">
              Latest <em className="italic text-[#fca5a5]">Movies</em>
            </h1>
            <p className="text-base text-white/45 leading-[1.6] max-w-[520px] m-0">
              Browse every film in theaters, hold your seats in seconds, and walk in with the ticket
              in hand.
            </p>
          </div>

          {/* ── Search bar ── */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-0">
            <div className="flex-1 flex items-center bg-white/5 border border-white/10 rounded-xl px-4 gap-3 transition-[border-color,background] duration-200 focus-within:border-[#dc2626]/50 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_0_3px_rgba(220,38,38,0.08)]">
              <div className="text-white/30 flex shrink-0">
                <Search size={18} />
              </div>
              <input
                id="movies-search-input"
                type="text"
                className="flex-1 bg-transparent border-none outline-none text-[#fafafa] text-[0.9375rem] [font-family:var(--body,'Archivo',sans-serif)] py-3.5 placeholder:text-white/25"
                placeholder='Search "The Quiet Hour", "Thriller", ...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
              {search && (
                <button
                  className="bg-transparent border-none text-white/35 cursor-pointer flex items-center p-1 rounded-full transition-colors duration-150 hover:text-[#fafafa] hover:bg-white/[0.08]"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              className={`flex items-center justify-center sm:justify-start gap-2 py-3.5 px-5 rounded-xl text-sm [font-family:var(--body,'Archivo',sans-serif)] cursor-pointer transition-all duration-150 whitespace-nowrap border ${
                showFilters
                  ? "text-[#fafafa] border-[#dc2626]/40 bg-[#dc2626]/10"
                  : "text-white/65 bg-white/5 border-white/10 hover:text-[#fafafa] hover:border-[#dc2626]/40 hover:bg-[#dc2626]/10"
              }`}
              onClick={() => setShowFilters((v) => !v)}
              aria-label="Toggle filters"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* ── Inline filters (genre + sort) ── */}
          {showFilters && (
            <div className="mt-4 p-5 bg-white/[0.03] border border-white/[0.07] rounded-xl flex flex-col gap-4 animate-[slideDown_0.2s_ease]">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
                <span className="text-xs font-semibold text-white/35 uppercase tracking-[0.08em] whitespace-nowrap pt-1.5 min-w-[56px]">
                  Genre
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    className={`py-[0.3rem] px-3 rounded-full text-[0.8125rem] [font-family:var(--body,'Archivo',sans-serif)] cursor-pointer transition-all duration-150 border ${
                      selectedGenre === null
                        ? "bg-[#dc2626]/20 border-[#dc2626]/50 text-[#fca5a5]"
                        : "bg-white/5 border-white/[0.08] text-white/55 hover:text-[#fafafa] hover:border-white/20"
                    }`}
                    onClick={() => setSelectedGenre(null)}
                  >
                    All
                  </button>
                  {ALL_GENRES.map((g) => (
                    <button
                      key={g}
                      className={`py-[0.3rem] px-3 rounded-full text-[0.8125rem] [font-family:var(--body,'Archivo',sans-serif)] cursor-pointer transition-all duration-150 border ${
                        selectedGenre === g
                          ? "bg-[#dc2626]/20 border-[#dc2626]/50 text-[#fca5a5]"
                          : "bg-white/5 border-white/[0.08] text-white/55 hover:text-[#fafafa] hover:border-white/20"
                      }`}
                      onClick={() => setSelectedGenre(g === selectedGenre ? null : g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-start">
                <span className="text-xs font-semibold text-white/35 uppercase tracking-[0.08em] whitespace-nowrap pt-1.5 min-w-[56px]">
                  Sort by
                </span>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`py-[0.3rem] px-3 rounded-full text-[0.8125rem] [font-family:var(--body,'Archivo',sans-serif)] cursor-pointer transition-all duration-150 border ${
                        sortBy === opt.value
                          ? "bg-[#dc2626]/20 border-[#dc2626]/50 text-[#fca5a5]"
                          : "bg-white/5 border-white/[0.08] text-white/55 hover:text-[#fafafa] hover:border-white/20"
                      }`}
                      onClick={() => setSortBy(opt.value)}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Genre quick-filter strip (always visible) ── */}
      <div className="bg-[#09090b]/95 border-b border-white/[0.06] sticky top-0 z-20 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto py-2.5 px-6 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[0.8125rem] [font-family:var(--body,'Archivo',sans-serif)] cursor-pointer whitespace-nowrap transition-all duration-150 border ${
              selectedGenre === null
                ? "bg-[#dc2626] border-[#dc2626] text-white font-semibold"
                : "bg-transparent border-white/[0.08] text-white/50 hover:text-[#fafafa] hover:border-white/20 hover:bg-white/5"
            }`}
            onClick={() => setSelectedGenre(null)}
          >
            <TrendingUp size={13} />
            All
          </button>
          {ALL_GENRES.map((g) => (
            <button
              key={g}
              className={`flex items-center gap-1.5 py-1.5 px-3.5 rounded-full text-[0.8125rem] [font-family:var(--body,'Archivo',sans-serif)] cursor-pointer whitespace-nowrap transition-all duration-150 border ${
                selectedGenre === g
                  ? "bg-[#dc2626] border-[#dc2626] text-white font-semibold"
                  : "bg-transparent border-white/[0.08] text-white/50 hover:text-[#fafafa] hover:border-white/20 hover:bg-white/5"
              }`}
              onClick={() => setSelectedGenre(g === selectedGenre ? null : g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="max-w-[1280px] mx-auto pt-8 px-6 pb-16">
        {/* Results meta */}
        {!movies ||
          (!isPending && !error && (
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-white/40">
                {movies.length} {movies.length === 1 ? "film" : "films"} found
              </span>
              {(search || selectedGenre) && (
                <button
                  className="flex items-center gap-1.5 text-[0.8125rem] text-[#f87171] bg-transparent border-none cursor-pointer py-1 px-2 rounded-md transition-colors duration-150 [font-family:var(--body,'Archivo',sans-serif)] hover:bg-[#dc2626]/10"
                  onClick={() => {
                    setSearch("");
                    setSelectedGenre(null);
                  }}
                >
                  <X size={12} />
                  Clear filters
                </button>
              )}
            </div>
          ))}

        {/* Loading skeletons */}
        {isPending && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 px-4 text-center text-white/30">
            <Clapperboard size={48} strokeWidth={1} />
            <h2 className="[font-family:var(--display,'Fraunces',serif)] text-2xl font-semibold text-white/60 m-0">
              Failed to load movies
            </h2>
            <p className="text-[0.9375rem] m-0 max-w-[320px]">
              Please check your connection and try again.
            </p>
          </div>
        )}

        {/* Empty state */}
        {!isPending && !error && movies.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20 px-4 text-center text-white/30">
            <Search size={48} strokeWidth={1} />
            <h2 className="[font-family:var(--display,'Fraunces',serif)] text-2xl font-semibold text-white/60 m-0">
              No results found
            </h2>
            <p className="text-[0.9375rem] m-0 max-w-[320px]">
              No films matched{" "}
              {search ? `"${search}"` : selectedGenre ? `genre "${selectedGenre}"` : "your filters"}
              .
            </p>
            <button
              className="mt-2 py-2.5 px-6 bg-[#dc2626] text-white border-none rounded-lg text-[0.9375rem] font-semibold cursor-pointer [font-family:var(--body,'Archivo',sans-serif)] transition-colors duration-150 hover:bg-[#b91c1c]"
              onClick={() => {
                setSearch("");
                setSelectedGenre(null);
              }}
            >
              Show all movies
            </button>
          </div>
        )}

        {/* Movie grid */}
        {!isPending && !error && movies.length > 0 && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {movies.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
