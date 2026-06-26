"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { env } from "@movie-ticket-booking/env/web";
import SelectTheatreMovieSeat from "@/components/SelectSeatComponent";
import BuyTheatreMovieSeat from "@/components/BuySeatComponent";

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

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

async function fetchTheatreMovieSeats(
  movieId: string,
  theatreMovieId: string,
): Promise<TheatreMovieSeatDto[]> {
  console.log(env.NEXT_PUBLIC_SERVER_URL);
  const res = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/movies/${movieId}/${theatreMovieId}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch seats: ${res.status}`);
  }

  const json: ApiResponse<TheatreMovieSeatDto[]> = await res.json();
  console.log("json data:", json);

  if (!json.success) {
    throw new Error(json.message || "Failed to fetch theatre movie seats");
  }

  return json.data;
}

function useTheatreMovieSeats(movieId: string, theatreMovieId: string) {
  return useQuery({
    queryKey: ["theatre-movie-seats", theatreMovieId],
    queryFn: () => fetchTheatreMovieSeats(movieId, theatreMovieId),
    enabled: !!theatreMovieId,
    staleTime: 0, // seat availability changes fast, don't cache stale state
  });
}

interface ProceedBarProps {
  selectedSeat: TheatreMovieSeatDto | null;
  onProceed: () => void;
  isProceeding: boolean;
}

function ProceedBar({ isProceeding, selectedSeat, onProceed }: ProceedBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-zinc-500">
            {selectedSeat ? "Selected seat" : "No seat selected"}
          </span>
          <span className="text-sm font-medium text-zinc-100">
            {selectedSeat
              ? `${selectedSeat.seat.row}${selectedSeat.seat.col} · ₹${selectedSeat.price}`
              : "Tap a seat to continue"}
          </span>
        </div>
        <button
          type="button"
          disabled={!selectedSeat}
          onClick={onProceed}
          className="rounded-lg bg-red-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          {isProceeding ? "Proceeding" : "Proceed to buy"}
        </button>
      </div>
    </div>
  );
}

export default function TheatreMoviePage() {
  const { movieId, theatreMovieId } = useParams<{
    movieId: string;
    theatreMovieId: string;
  }>();

  const { data: seats, isLoading, isError } = useTheatreMovieSeats(movieId, theatreMovieId);
  const [selectedSeat, setSelectedSeat] = useState<TheatreMovieSeatDto | null>(null);
  const [isProceeding, setIsProceeding] = useState<boolean>(false);
  const [isBuying, setIsBuying] = useState<boolean>(false);

  const reserveSeatFn = async () => {
    const fetchUrl = `${env.NEXT_PUBLIC_SERVER_URL}/movies/${movieId}/${theatreMovieId}/reserve/${selectedSeat?.id}`;
    const res = await fetch(fetchUrl, {
      method: "POST",
    });

    if (!res.ok) return;
    const data = await res.json();
    console.log("reserve seat data: ", data);
    return data;
  };

  const proceedToBuyMutation = useMutation({
    mutationFn: reserveSeatFn,
    onSuccess: () => {
      // router.push(`/buy` as Route);
      setIsProceeding(false);
      setIsBuying(true);
    },
  });

  const handleProceed = () => {
    if (!selectedSeat || isProceeding) return;
    setIsProceeding(true);
    proceedToBuyMutation.mutate();
  };

  const handleSelectSeat = (seat: TheatreMovieSeatDto) => {
    setSelectedSeat((prev) => (prev?.id === seat.id ? null : seat));
  };

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-zinc-500">
        Loading seats…
      </div>
    );
  }

  if (isError || !seats) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-medium text-zinc-300">Couldn't load seats for this show.</p>
        <p className="text-xs text-zinc-500">Try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 pb-28 pt-6">
      {isBuying && <BuyTheatreMovieSeat />}
      {!isBuying && (
        <SelectTheatreMovieSeat
          seats={seats.theatreMovieSeatsData}
          selectedSeatId={selectedSeat?.id ?? null}
          onSelectSeat={handleSelectSeat}
        />
      )}
      {!isBuying && (
        <ProceedBar
          isProceeding={isProceeding}
          selectedSeat={selectedSeat}
          onProceed={handleProceed}
        />
      )}
    </div>
  );
}
