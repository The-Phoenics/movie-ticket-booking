"use client";

import { useAuth } from "@/components/auth-provider";
import UserMenu from "@/components/user-menu";
import { env } from "@movie-ticket-booking/env/web";
import { useQuery } from "@tanstack/react-query";
import { Search, Star, Clock, Filter, X, Clapperboard, ChevronRight, Flame, TrendingUp } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";

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

const ALL_GENRES = ["Action", "Drama", "Thriller", "Comedy", "Romance", "Horror", "Sci-Fi", "Adventure", "Mystery", "Biography", "Animation", "Fantasy"];

const SORT_OPTIONS = [
  { value: "rating", label: "Top Rated" },
  { value: "title", label: "A–Z" },
  { value: "newest", label: "Newest First" },
];

function MovieCardSkeleton() {
  return (
    <div className="movies-card-skeleton">
      <div className="skeleton-poster" />
      <div className="skeleton-body">
        <div className="skeleton-line wide" />
        <div className="skeleton-line medium" />
        <div className="skeleton-line narrow" />
      </div>
    </div>
  );
}

function MovieCard({ movie, index }: { movie: Movie; index: number }) {
  const router = useRouter();
  const gradient = POSTER_GRADIENTS[index % POSTER_GRADIENTS.length];
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];
  const genres = movie.genres ?? FALLBACK_GENRES[index % FALLBACK_GENRES.length];

  return (
    <article
      className="movie-card"
      onClick={() => router.push((`/movies/${movie.id}`) as Route)}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      {/* Poster */}
      <div className={`movie-card-poster bg-gradient-to-br ${gradient}`}>
        {/* Rating badge */}
        <div className="movie-rating-badge">
          <Star className="rating-star-icon" />
          <span>{movie.rating?.toFixed?.(1) ?? "—"}</span>
        </div>

        {/* Format tags */}
        <div className="movie-format-tags">
          <span className="format-tag">2D</span>
          <span className="format-tag">IMAX</span>
        </div>

        {/* Poster overlay shimmer */}
        <div className="poster-shimmer" />

        {/* Clapperboard placeholder icon */}
        <div className="poster-placeholder-icon">
          <Clapperboard size={40} strokeWidth={1} />
        </div>
      </div>

      {/* Card body */}
      <div className="movie-card-body">
        <h3 className="movie-card-title">{movie.title}</h3>

        <div className="movie-card-genres">
          {genres.slice(0, 2).map((genre) => (
            <span key={genre} className="genre-chip">
              {genre}
            </span>
          ))}
        </div>

        <p className="movie-card-desc">{movie.description}</p>

        <div className="movie-card-footer">
          <div className="movie-card-meta">
            {movie.duration && (
              <span className="meta-item">
                <Clock size={11} />
                {movie.duration}
              </span>
            )}
          </div>
          <Link
            href={(`/movies/${movie.id}`) as Route}
            className="book-btn"
            onClick={(e) => e.stopPropagation()}
          >
            Book
            <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function MoviesPage() {
  const user = useAuth()
  console.log("user: ", user)
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("rating");
  const [showFilters, setShowFilters] = useState(false);

  const { isPending, error, data } = useQuery<MoviesResponse>({
    queryKey: ["moviesData"],
    queryFn: () =>
      fetch(env.NEXT_PUBLIC_SERVER_URL + "/movies").then((res) => res.json()),
  });

  const movies: Movie[] = data?.data?.movies ?? [];

  const filtered = useMemo(() => {
    let list = [...movies];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description?.toLowerCase().includes(q)
      );
    }

    if (selectedGenre) {
      list = list.filter((m, i) => {
        const genres = m.genres ?? FALLBACK_GENRES[i % FALLBACK_GENRES.length];
        return genres.some((g) => g.toLowerCase() === selectedGenre.toLowerCase());
      });
    }

    if (sortBy === "rating") {
      list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [movies, search, selectedGenre, sortBy]);

  return (
    <div className="movies-page">
      {/* ── Header / Hero ── */}
      <header className="movies-header">
        <div className="movies-header-bg" />
        <div className="movies-header-glow" />

        <div className="movies-header-inner">
          {/* Brand row */}
          <div className="brand-row">
            <Link href="/" className="brand-logo">
              Reel<span className="brand-dot">.</span>
            </Link>
            <nav className="header-nav">
              <a className="nav-link active">Now Showing</a>
              <a className="nav-link">Coming Soon</a>
              <a className="nav-link">Events</a>
            </nav>
            <div style={{ marginLeft: "auto" }}>
              <UserMenu />
            </div>
          </div>

          {/* Hero copy */}
          <div className="hero-copy">
            <div className="hero-eyebrow">
              <Flame size={14} />
              Now Showing · Delhi NCR
            </div>
            <h1 className="hero-headline">
              Latest <em>Movies</em>
            </h1>
            <p className="hero-sub">
              Browse every film in theaters, hold your seats in seconds, and walk in with the ticket in hand.
            </p>
          </div>

          {/* ── Search bar ── */}
          <div className="search-container">
            <div className="search-bar">
              <div className="search-icon-wrap">
                <Search size={18} />
              </div>
              <input
                id="movies-search-input"
                type="text"
                className="search-input"
                placeholder='Search "The Quiet Hour", "Thriller", ...'
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
              />
              {search && (
                <button
                  className="search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <button
              className={`filter-toggle-btn ${showFilters ? "active" : ""}`}
              onClick={() => setShowFilters((v) => !v)}
              aria-label="Toggle filters"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          {/* ── Inline filters (genre + sort) ── */}
          {showFilters && (
            <div className="filters-panel">
              <div className="filter-group">
                <span className="filter-label">Genre</span>
                <div className="filter-chips">
                  <button
                    className={`filter-chip ${selectedGenre === null ? "active" : ""}`}
                    onClick={() => setSelectedGenre(null)}
                  >
                    All
                  </button>
                  {ALL_GENRES.map((g) => (
                    <button
                      key={g}
                      className={`filter-chip ${selectedGenre === g ? "active" : ""}`}
                      onClick={() => setSelectedGenre(g === selectedGenre ? null : g)}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <span className="filter-label">Sort by</span>
                <div className="filter-chips">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      className={`filter-chip ${sortBy === opt.value ? "active" : ""}`}
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
      <div className="genre-strip-wrapper">
        <div className="genre-strip">
          <button
            className={`genre-pill-btn ${selectedGenre === null ? "active" : ""}`}
            onClick={() => setSelectedGenre(null)}
          >
            <TrendingUp size={13} />
            All
          </button>
          {ALL_GENRES.map((g) => (
            <button
              key={g}
              className={`genre-pill-btn ${selectedGenre === g ? "active" : ""}`}
              onClick={() => setSelectedGenre(g === selectedGenre ? null : g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="movies-main">
        {/* Results meta */}
        {!isPending && !error && (
          <div className="results-meta">
            <span className="results-count">
              {filtered.length} {filtered.length === 1 ? "film" : "films"} found
            </span>
            {(search || selectedGenre) && (
              <button
                className="clear-all-btn"
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
        )}

        {/* Loading skeletons */}
        {isPending && (
          <div className="movies-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="movies-error">
            <Clapperboard size={48} strokeWidth={1} />
            <h2>Failed to load movies</h2>
            <p>Please check your connection and try again.</p>
          </div>
        )}

        {/* Empty state */}
        {!isPending && !error && filtered.length === 0 && (
          <div className="movies-empty">
            <Search size={48} strokeWidth={1} />
            <h2>No results found</h2>
            <p>
              No films matched{" "}
              {search ? `"${search}"` : selectedGenre ? `genre "${selectedGenre}"` : "your filters"}.
            </p>
            <button
              className="empty-reset-btn"
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
        {!isPending && !error && filtered.length > 0 && (
          <div className="movies-grid">
            {filtered.map((movie, i) => (
              <MovieCard key={movie.id} movie={movie} index={i} />
            ))}
          </div>
        )}
      </main>

      <style>{`
        /* ── Reset & Base ── */
        .movies-page {
          min-height: 100vh;
          background: #09090b;
          color: #fafafa;
          font-family: var(--body, 'Archivo', sans-serif);
        }

        /* ── Header ── */
        .movies-header {
          position: relative;
          overflow: hidden;
          padding-bottom: 2rem;
        }

        .movies-header-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, #18181b 0%, #09090b 60%, #0a0a12 100%);
        }

        .movies-header-glow {
          position: absolute;
          top: -120px;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 400px;
          background: radial-gradient(ellipse, rgba(220,38,38,0.18) 0%, transparent 70%);
          pointer-events: none;
        }

        .movies-header-inner {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        /* ── Brand row ── */
        .brand-row {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          padding: 1.25rem 0 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 2.5rem;
        }

        .brand-logo {
          font-family: var(--display, 'Fraunces', serif);
          font-size: 1.5rem;
          font-weight: 600;
          color: #fafafa;
          text-decoration: none;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }

        .brand-dot {
          color: #dc2626;
        }

        .header-nav {
          display: flex;
          gap: 0.25rem;
        }

        .nav-link {
          padding: 0.4rem 0.875rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          transition: color 0.15s, background 0.15s;
          text-decoration: none;
        }

        .nav-link:hover {
          color: rgba(255,255,255,0.9);
          background: rgba(255,255,255,0.06);
        }

        .nav-link.active {
          color: #fafafa;
          background: rgba(220,38,38,0.15);
        }

        /* ── Hero copy ── */
        .hero-copy {
          margin-bottom: 2rem;
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8125rem;
          font-weight: 500;
          color: #dc2626;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 0.75rem;
        }

        .hero-headline {
          font-family: var(--display, 'Fraunces', serif);
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 600;
          line-height: 1.1;
          color: #fafafa;
          margin: 0 0 0.75rem;
          letter-spacing: -0.03em;
        }

        .hero-headline em {
          font-style: italic;
          color: #fca5a5;
        }

        .hero-sub {
          font-size: 1rem;
          color: rgba(255,255,255,0.45);
          line-height: 1.6;
          max-width: 520px;
          margin: 0;
        }

        /* ── Search ── */
        .search-container {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          margin-bottom: 0;
        }

        .search-bar {
          flex: 1;
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 0 1rem;
          gap: 0.75rem;
          transition: border-color 0.2s, background 0.2s;
        }

        .search-bar:focus-within {
          border-color: rgba(220,38,38,0.5);
          background: rgba(255,255,255,0.07);
          box-shadow: 0 0 0 3px rgba(220,38,38,0.08);
        }

        .search-icon-wrap {
          color: rgba(255,255,255,0.3);
          display: flex;
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fafafa;
          font-size: 0.9375rem;
          font-family: var(--body, 'Archivo', sans-serif);
          padding: 0.875rem 0;
        }

        .search-input::placeholder {
          color: rgba(255,255,255,0.25);
        }

        .search-clear {
          background: none;
          border: none;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          display: flex;
          align-items: center;
          padding: 4px;
          border-radius: 50%;
          transition: color 0.15s, background 0.15s;
        }

        .search-clear:hover {
          color: #fafafa;
          background: rgba(255,255,255,0.08);
        }

        .filter-toggle-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.25rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          color: rgba(255,255,255,0.65);
          font-size: 0.875rem;
          font-family: var(--body, 'Archivo', sans-serif);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }

        .filter-toggle-btn:hover,
        .filter-toggle-btn.active {
          color: #fafafa;
          border-color: rgba(220,38,38,0.4);
          background: rgba(220,38,38,0.1);
        }

        /* ── Filters panel ── */
        .filters-panel {
          margin-top: 1rem;
          padding: 1.25rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          animation: slideDown 0.2s ease;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .filter-group {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .filter-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          white-space: nowrap;
          padding-top: 0.375rem;
          min-width: 56px;
        }

        .filter-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .filter-chip {
          padding: 0.3rem 0.75rem;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 9999px;
          color: rgba(255,255,255,0.55);
          font-size: 0.8125rem;
          font-family: var(--body, 'Archivo', sans-serif);
          cursor: pointer;
          transition: all 0.15s;
        }

        .filter-chip:hover {
          color: #fafafa;
          border-color: rgba(255,255,255,0.2);
        }

        .filter-chip.active {
          background: rgba(220,38,38,0.2);
          border-color: rgba(220,38,38,0.5);
          color: #fca5a5;
        }

        /* ── Genre quick-filter strip ── */
        .genre-strip-wrapper {
          background: rgba(9,9,11,0.95);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          position: sticky;
          top: 0;
          z-index: 20;
          backdrop-filter: blur(12px);
        }

        .genre-strip {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0.625rem 1.5rem;
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .genre-strip::-webkit-scrollbar { display: none; }

        .genre-pill-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.375rem 0.875rem;
          border-radius: 9999px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: rgba(255,255,255,0.5);
          font-size: 0.8125rem;
          font-family: var(--body, 'Archivo', sans-serif);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.15s;
        }

        .genre-pill-btn:hover {
          color: #fafafa;
          border-color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.05);
        }

        .genre-pill-btn.active {
          background: #dc2626;
          border-color: #dc2626;
          color: #fff;
          font-weight: 600;
        }

        /* ── Main content ── */
        .movies-main {
          max-width: 1280px;
          margin: 0 auto;
          padding: 2rem 1.5rem 4rem;
        }

        /* ── Results meta ── */
        .results-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .results-count {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.4);
        }

        .clear-all-btn {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 0.8125rem;
          color: #f87171;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          transition: background 0.15s;
          font-family: var(--body, 'Archivo', sans-serif);
        }

        .clear-all-btn:hover {
          background: rgba(220,38,38,0.1);
        }

        /* ── Movies grid ── */
        .movies-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        /* ── Movie card ── */
        .movie-card {
          background: #18181b;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
          cursor: pointer;
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), 
                      box-shadow 0.22s ease,
                      border-color 0.2s;
          display: flex;
          flex-direction: column;
        }

        .movie-card:hover {
          transform: translateY(-6px) scale(1.01);
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px var(--accent, #dc2626);
          border-color: var(--accent, #dc2626);
        }

        /* Poster */
        .movie-card-poster {
          position: relative;
          height: 280px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .poster-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%);
          pointer-events: none;
        }

        .poster-placeholder-icon {
          color: rgba(255,255,255,0.12);
          transition: transform 0.3s ease, color 0.3s;
        }

        .movie-card:hover .poster-placeholder-icon {
          color: rgba(255,255,255,0.22);
          transform: scale(1.1);
        }

        .movie-rating-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 8px;
          padding: 4px 8px;
          font-size: 0.8125rem;
          font-weight: 600;
          color: #fbbf24;
        }

        .rating-star-icon {
          width: 11px;
          height: 11px;
          fill: #fbbf24;
          stroke: none;
        }

        .movie-format-tags {
          position: absolute;
          bottom: 10px;
          left: 10px;
          display: flex;
          gap: 5px;
        }

        .format-tag {
          background: rgba(0,0,0,0.65);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 5px;
          padding: 2px 7px;
          font-size: 0.6875rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: rgba(255,255,255,0.75);
        }

        /* Card body */
        .movie-card-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          flex: 1;
        }

        .movie-card-title {
          font-family: var(--display, 'Fraunces', serif);
          font-size: 1rem;
          font-weight: 600;
          color: #fafafa;
          line-height: 1.3;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .movie-card-genres {
          display: flex;
          flex-wrap: wrap;
          gap: 0.375rem;
        }

        .genre-chip {
          font-size: 0.6875rem;
          font-weight: 500;
          color: rgba(255,255,255,0.5);
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 2px 6px;
          letter-spacing: 0.03em;
        }

        .movie-card-desc {
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.38);
          line-height: 1.5;
          margin: 0;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .movie-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 0.25rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        .movie-card-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.35);
        }

        .book-btn {
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 0.375rem 0.875rem;
          background: #dc2626;
          color: #fff;
          font-size: 0.8125rem;
          font-weight: 600;
          font-family: var(--body, 'Archivo', sans-serif);
          border-radius: 8px;
          text-decoration: none;
          transition: background 0.15s, transform 0.15s;
        }

        .book-btn:hover {
          background: #b91c1c;
          transform: scale(1.04);
        }

        /* ── Skeleton ── */
        .movies-card-skeleton {
          background: #18181b;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px;
          overflow: hidden;
        }

        .skeleton-poster {
          height: 280px;
          background: linear-gradient(90deg, #27272a 25%, #3f3f46 50%, #27272a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-body {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.625rem;
        }

        .skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, #27272a 25%, #3f3f46 50%, #27272a 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        .skeleton-line.wide { width: 80%; }
        .skeleton-line.medium { width: 55%; }
        .skeleton-line.narrow { width: 40%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Empty / Error states ── */
        .movies-empty,
        .movies-error {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 5rem 1rem;
          text-align: center;
          color: rgba(255,255,255,0.3);
        }

        .movies-empty h2,
        .movies-error h2 {
          font-family: var(--display, 'Fraunces', serif);
          font-size: 1.5rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          margin: 0;
        }

        .movies-empty p,
        .movies-error p {
          font-size: 0.9375rem;
          margin: 0;
          max-width: 320px;
        }

        .empty-reset-btn {
          margin-top: 0.5rem;
          padding: 0.625rem 1.5rem;
          background: #dc2626;
          color: #fff;
          border: none;
          border-radius: 8px;
          font-size: 0.9375rem;
          font-weight: 600;
          cursor: pointer;
          font-family: var(--body, 'Archivo', sans-serif);
          transition: background 0.15s;
        }

        .empty-reset-btn:hover {
          background: #b91c1c;
        }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .brand-row { flex-wrap: wrap; gap: 1rem; }
          .header-nav { gap: 0; }
          .nav-link { padding: 0.4rem 0.625rem; font-size: 0.8125rem; }
          .search-container { flex-direction: column; align-items: stretch; }
          .filter-toggle-btn { justify-content: center; }
          .movies-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
          .movie-card-poster { height: 220px; }
          .filter-group { flex-direction: column; gap: 0.5rem; }
        }
      `}</style>
    </div>
  );
}
