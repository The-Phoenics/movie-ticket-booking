"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import { CheckCircle2, Loader2, Ticket } from "lucide-react";
import Link from "next/link";

function SuccessContent() {
  const searchParams = useSearchParams();
  const paymentIntentId = searchParams.get("payment_intent");

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden">
        {/* Top gradient */}
        <div className="h-1 bg-gradient-to-r from-green-600 via-emerald-500 to-teal-400" />

        {/* Content */}
        <div className="flex flex-col items-center gap-5 px-8 py-10 text-center">
          {/* Icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>

          <div>
            <h1 className="text-2xl font-bold text-zinc-100">Booking Confirmed!</h1>
            <p className="mt-2 text-sm text-zinc-400">
              Your seat is reserved. Enjoy the show! 🎬
            </p>
          </div>

          {paymentIntentId && (
            <div className="rounded-lg border border-zinc-700 bg-zinc-800/50 px-4 py-3 w-full">
              <p className="text-xs uppercase tracking-wide text-zinc-500 mb-1">Payment Reference</p>
              <p className="text-xs font-mono text-zinc-300 break-all">{paymentIntentId}</p>
            </div>
          )}

          <div className="flex flex-col gap-3 w-full pt-2">
            <Link
              href={"/movies" as any}
              className="flex items-center justify-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:bg-red-500 active:scale-[0.98]"
            >
              <Ticket className="h-4 w-4" />
              Browse More Movies
            </Link>
            <Link
              href="/"
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800 px-6 py-3 text-center">
          <p className="text-xs text-zinc-600">
            A confirmation will be sent to your registered email.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
