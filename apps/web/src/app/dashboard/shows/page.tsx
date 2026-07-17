"use client";

import { useAuth } from "@/components/auth-provider";
import { useTheatre } from "../seats/query";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import ShowCard from "@/components/show-card";
import { useTheatreActiveShows, type TheatreActiveShowsResponse } from "./query";

export default function TheatreShows() {
  const session = useAuth();
  const theatreQuery = useTheatre(session);
  const activeShowsQuery = useTheatreActiveShows(theatreQuery.data?.id);
  const [shows, setShows] = useState<TheatreActiveShowsResponse["data"]>([]);

  useEffect(() => {
    console.log(activeShowsQuery.data);
    setShows(activeShowsQuery.data ?? []);
  }, [activeShowsQuery.data]);

  if (activeShowsQuery.isPending) {
    return (
      <div className="pt-64 bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (activeShowsQuery.isPending) {
    return (
      <div className="pt-64 bg-zinc-950 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
      </div>
    );
  }

  if (activeShowsQuery.isError) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#09090b] px-6">
        <div className="max-w-sm text-center">
          <p className="text-sm font-medium text-red-400">Couldn't load theatre shows</p>
          <p className="mt-1 text-sm text-zinc-500">{activeShowsQuery.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full p-8">
      <div className="w-full">
        {session?.user && (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-5">
            {shows.map((show) => (
              <ShowCard key={show.id} movie={show.movie} user={session.user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
