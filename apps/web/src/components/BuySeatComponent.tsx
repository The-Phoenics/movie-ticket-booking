"use client";

import { env } from "@movie-ticket-booking/env/web";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Calendar, Clock, Armchair, Ticket, CreditCard, Tag } from "lucide-react";

type SeatStatus = "AVAILABLE" | "SOLD";

interface TheatreMovieSeatDto {
  id: string;
  theatreMovieId: string;
  seatId: string;
  status: SeatStatus;
  price: number;
  seat: {
    id: string;
    row: string;
    col: number;
  };
}

interface TheatreData {
  id: string;
  title: string;
  address: string;
  city: string;
  country: string;
}

interface ShowTime {
  start: string;
  end: string;
}

interface BuyTheatreMovieSeatProps {
  selectedSeat: TheatreMovieSeatDto;
  movieTitle: string;
  theatreData: TheatreData | null;
  showTime: ShowTime | null;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function BuyTheatreMovieSeat({
  selectedSeat,
  movieTitle,
  theatreData,
  showTime,
}: BuyTheatreMovieSeatProps) {
  const { movieId, theatreMovieId } = useParams<{
    movieId: string;
    theatreMovieId: string;
  }>();
  const router = useRouter();

  const buySeatFn = async () => {
    const fetchUrl = `${env.NEXT_PUBLIC_SERVER_URL}/movies/${movieId}/${theatreMovieId}/book/${selectedSeat.id}`;
    const res = await fetch(fetchUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        currency: "USD", // TODO: setup shared types for web and server apps, use prisma generated CURRENCY enum type
        amount: selectedSeat.price,
      }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData?.message || "Failed to initiate booking");
    }

    const data = await res.json();
    return data;
  };

  const buySeatMutation = useMutation({
    mutationFn: buySeatFn,
    onSuccess: (data) => {
      const clientSecret: string | null = data?.data?.clientSecret ?? null;
      const orderId: string | null = data?.data?.orderId ?? null;
      if (!clientSecret) {
        console.error("No clientSecret returned from book API");
        return;
      }
      const params = new URLSearchParams({ clientSecret });
      if (orderId) params.set("orderId", orderId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push(`/checkout?${params.toString()}` as any);
    },
  });

  const handleBuy = () => {
    if (buySeatMutation.isPending) return;
    buySeatMutation.mutate();
  };

  const isPending = buySeatMutation.isPending;
  const isError = buySeatMutation.isError;

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-8 gap-6">
      {/* Card */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Decorative top gradient */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-red-700 via-red-500 to-orange-400" />

        {/* Ticket header */}
        <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-zinc-800">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600/15 text-red-400">
            <Ticket className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">Booking Summary</p>
            <h2 className="text-lg font-bold text-zinc-100 leading-tight">{movieTitle}</h2>
          </div>
        </div>

        {/* Dashed divider (ticket perforation) */}
        <div className="relative flex items-center px-6 py-0">
          <div className="absolute -left-3 h-6 w-6 rounded-full bg-zinc-950 border border-zinc-800" />
          <div className="flex-1 border-t border-dashed border-zinc-700" />
          <div className="absolute -right-3 h-6 w-6 rounded-full bg-zinc-950 border border-zinc-800" />
        </div>

        {/* Details grid */}
        <div className="px-6 py-5 grid grid-cols-2 gap-x-6 gap-y-5">
          {/* Theatre */}
          {theatreData && (
            <div className="col-span-2 flex items-start gap-3">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Theatre</p>
                <p className="text-sm font-semibold text-zinc-100">{theatreData.title}</p>
                <p className="text-xs text-zinc-500">
                  {theatreData.address}, {theatreData.city}, {theatreData.country}
                </p>
              </div>
            </div>
          )}

          {/* Date */}
          {showTime && (
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Date</p>
                <p className="text-sm font-semibold text-zinc-100">{formatDate(showTime.start)}</p>
              </div>
            </div>
          )}

          {/* Time */}
          {showTime && (
            <div className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">Show Time</p>
                <p className="text-sm font-semibold text-zinc-100">
                  {formatTime(showTime.start)}
                  <span className="text-zinc-500 mx-1">–</span>
                  {formatTime(showTime.end)}
                </p>
              </div>
            </div>
          )}

          {/* Seat */}
          <div className="flex items-start gap-3">
            <Armchair className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Seat</p>
              <p className="text-sm font-semibold text-zinc-100">
                Row {selectedSeat.seat.row} · Seat {selectedSeat.seat.col}
              </p>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-start gap-3">
            <Tag className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <div>
              <p className="text-xs uppercase tracking-wide text-zinc-500">Price</p>
              <p className="text-sm font-semibold text-zinc-100">₹{selectedSeat.price.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Dashed divider (bottom perforation) */}
        <div className="relative flex items-center px-6 py-0">
          <div className="absolute -left-3 h-6 w-6 rounded-full bg-zinc-950 border border-zinc-800" />
          <div className="flex-1 border-t border-dashed border-zinc-700" />
          <div className="absolute -right-3 h-6 w-6 rounded-full bg-zinc-950 border border-zinc-800" />
        </div>

        {/* Total */}
        <div className="flex items-center justify-between px-6 py-5">
          <span className="text-sm font-semibold text-zinc-400">Total</span>
          <span className="text-2xl font-bold text-zinc-100">₹{selectedSeat.price.toFixed(2)}</span>
        </div>
      </div>

      {/* Error message */}
      {isError && (
        <p className="text-sm text-red-400 text-center max-w-sm">
          {(buySeatMutation.error as Error)?.message || "Something went wrong. Please try again."}
        </p>
      )}

      {/* Buy Button */}
      <button
        type="button"
        id="buy-seat-btn"
        onClick={handleBuy}
        disabled={isPending}
        className="flex items-center gap-2 rounded-xl bg-red-600 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-red-900/40 transition-all hover:bg-red-500 hover:shadow-red-800/50 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400 disabled:shadow-none"
      >
        <CreditCard className="h-4 w-4" />
        {isPending ? "Redirecting to payment…" : "Pay & Confirm Booking"}
      </button>
      <p className="text-xs text-zinc-600">Secure payment powered by Stripe</p>
    </div>
  );
}
