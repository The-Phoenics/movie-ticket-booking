import { isValidDate } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { env } from "@movie-ticket-booking/env/web";
import type { ServerApiResponseShape, Theatre } from "@movie-ticket-booking/shared/types";
import { set } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { ShowtimeFormValues } from "@/app/dashboard/movies/[movieId]/add/components/show-time-form";

export function useAddShowtimeMtn(theatre: Theatre, movieId: string, showtime: ShowtimeFormValues) {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => createShow(theatre, movieId, showtime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["theatre-showtimes"] });
      router.replace("/dashboard/shows");
    },
    onError: (error: { message?: string }) => {
      console.log("api fetch error:", error.message);
      toast.error(error.message || "Failed to add movie to theatre.");
    },
  });
}

async function createShow(theatre: Theatre, movieId: string, showtime: ShowtimeFormValues) {
  if (!theatre) throw new Error("No theatre selected");
  let showDateTime = new Date(showtime.date);
  if (!isValidDate(showDateTime)) {
    throw new Error("Invalid date");
  }
  const startTimeString = showtime.time.split(":");
  const hoursStr = startTimeString[0];
  const minutesStr = startTimeString[1];
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if (isNaN(hours) || hours > 24 || isNaN(minutes) || minutes > 60) {
    throw new Error("Invalid time");
  }

  showDateTime = set(showDateTime, {
    hours: hours,
    minutes: minutes,
  });
  try {
    const data = await addMovieShowToTheatre(theatre.id, movieId, {
      time: showDateTime,
      price: Number(showtime.price),
    });
    return data;
  } catch (err) {
    throw err;
  }
}

type AddMovieShowtimePayload = {
  time: Date;
  price: number;
};

async function addMovieShowToTheatre(theatreId: string, movieId: string, payload: AddMovieShowtimePayload) {
  const url = `${env.NEXT_PUBLIC_SERVER_URL}/owner/${theatreId}/movies/add`;
  let endTime = new Date(payload.time);
  endTime = set(endTime, {
    hours: endTime.getHours() + 3, // TODO: Hardcoded movie duration to 3 hours for now
  });
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      tmdbMovieId: movieId,
      startTime: payload.time,
      endTime: endTime,
      price: payload.price,
    }),
  });
  const result: ServerApiResponseShape = await res.json();
  console.log("result add show:  ", result);
  if (!result || !result.success) {
    throw new Error("Failed to add show");
  }
  return result.data;
}
