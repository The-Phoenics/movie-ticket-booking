import prisma from "@movie-ticket-booking/db";
import { createMovie } from "./movie.seed";
import { createTheatre } from "./theatre.seed";
import type { Show } from "@movie-ticket-booking/shared/types";

export async function createShow(overrides: Partial<Omit<Show, "id">> = {}) {
  let theatreId = overrides.theatreId;
  let movieId = overrides.movieId;

  if (!theatreId) {
    theatreId = (await createTheatre()).id;
  }

  if (!movieId) {
    movieId = (await createMovie()).id;
  }

  const start = new Date(Date.now() + 60 * 60 * 1000);

  return prisma.show.create({
    data: {
      theatreId,
      movieId,
      startTime: start,
      endTime: new Date(start.getTime() + 2 * 60 * 60 * 1000),
      ...overrides,
    },
  });
}
