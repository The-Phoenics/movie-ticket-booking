import Link from "next/link";
import type { Route } from "next";

export default function HomePage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black" />
      <div className="pointer-events-none absolute left-1/2 top-[-160px] h-[460px] w-[800px] -translate-x-1/2 rounded-full bg-red-600/15 blur-3xl" />

      {/* ── Nav ── */}
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-7">
        <span className="[font-family:var(--display,'Fraunces',serif)] text-xl font-semibold tracking-tight">
          Reel<span className="text-red-600">.</span>
        </span>
        <Link
          href={("/movies") as Route}
          className="rounded-full border border-white/10 px-4 py-[0.45rem] text-sm text-white/60 transition hover:border-red-600/40 hover:bg-red-600/10 hover:text-white"
        >
          Now Showing
        </Link>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-6 pb-20 pt-12 text-center">
        <p className="mb-4 text-[13px] font-medium uppercase tracking-[0.08em] text-red-600">
          Your City · Movie tickets, sorted
        </p>

        <h1 className="mb-5 [font-family:var(--display,'Fraunces',serif)] text-[clamp(2.5rem,6vw,4rem)] font-semibold leading-[1.08] tracking-tight">
          Pick a seat. <em className="text-red-300 italic">Not a queue.</em>
        </h1>

        <p className="mb-9 text-[1.0625rem] leading-relaxed text-white/50">
          Reel is where all cinephiles books its cinema — every showtime, every screen,
          held the moment you tap it.
        </p>

        <Link
          href={("/movies") as Route}
          className="inline-block rounded-[10px] bg-red-600 px-8 py-[0.9rem] text-[0.9375rem] font-semibold text-white transition hover:-translate-y-px hover:bg-red-700"
        >
          Browse Now Showing
        </Link>

        {/* Signature: ticket-tear divider */}
        <div className="mt-14 flex w-full max-w-[220px] items-center gap-2" aria-hidden="true">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/15" />
          <span className="flex-1 border-t border-dashed border-white/15" />
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/15" />
        </div>
      </main>
    </div>
  );
}