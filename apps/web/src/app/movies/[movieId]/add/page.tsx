"use client";

import { useTheatre, useTheatreSeatsLayout } from "@/app/seats/query";
import { useAuth } from "@/components/auth-provider";
import type { Seat, Theatre } from "@movie-ticket-booking/shared/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useFetchMovie } from "../query";

export default function AddMovieToTheatrePage() {
  const session = useAuth();
  const params = useParams<{
    movieId: string;
  }>();
  const movieId = params.movieId;
  const [theatre, setTheatre] = useState<Theatre | null>(null);
  const [seats, setSeats] = useState<Pick<Seat, "row" | "col">[]>([]);

  const movieQuery = useFetchMovie(movieId);
  const theatreQuery = useTheatre(session);
  const theatreSeatsLayout = useTheatreSeatsLayout(theatre?.id);

  useEffect(() => {
    const fetchedTheatre = theatreQuery.data ?? null;
    setTheatre(fetchedTheatre);
  }, [theatreQuery.data]);

  useEffect(() => {
    const fetchedTheatreSeats = theatreSeatsLayout.data ?? [];
    setSeats(fetchedTheatreSeats);
  }, [theatreSeatsLayout.data]);

  return <div>AddMovie</div>;
}
