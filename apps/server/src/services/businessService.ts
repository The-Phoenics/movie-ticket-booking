import { ServerApiError } from "@/lib";
import prisma from "@movie-ticket-booking/db";
import {
  SEAT_STATUS,
  type Theatre,
  type TheatreMovieSeat,
} from "@movie-ticket-booking/shared/types";
import type { MovieCreateInput } from "../../../../packages/db/prisma/generated/internal/prismaNamespace";

export async function createTheatre(theatreData: Omit<Theatre, "id">) {
  let created = null;
  try {
    created = await prisma.theatre.create({
      data: {
        ...theatreData,
      },
    });
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to create theatre", 501);
  }
  return created;
}

export async function createMovie(movieData: MovieCreateInput) {
  let created = null;
  try {
    created = await prisma.movie.create({
      data: {
        ...movieData,
      },
    });
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to create theatre", 501);
  }
  return created;
}

// check if theatre has minimum seats to add movie
export async function theatreNumOfSeats(theatreId: string) {
  let seatsCount = 0;
  try {
    seatsCount = await prisma.seat.count({
      where: {
        theatreId: theatreId,
      },
    });
  } catch (err) {
    throw new ServerApiError(
      "DB Error: Failed to count number of seats in theatre",
      501,
    );
  }
  return seatsCount ?? 0;
}

export async function addMovieToTheatre(
  theatreId: string,
  movieId: string,
  start: Date,
  end: Date,
  price: number,
) {
  try {
    // get all the seats of theatre
    const seats = await prisma.seat.findMany({
      where: {
        theatreId: theatreId,
      },
    });

    await prisma.$transaction(async (tx) => {
      const createdTheatreMovie = await tx.theatreMovie.create({
        data: {
          theatreId: theatreId,
          movieId: movieId,
          startTime: start,
          endTime: end,
        },
      });

      const theatreMovieSeatsData = seats.map((seat) => {
        const data: Omit<TheatreMovieSeat, "id"> = {
          theatreMovieId: createdTheatreMovie.id,
          seatId: seat.id,
          status: SEAT_STATUS.AVAILABLE,
          price: price,
        };
        return data;
      });

      // insert theatre movie seats rows using theatre's seats
      // mark all of them available initially
      await tx.theatreMovieSeat.createManyAndReturn({
        data: theatreMovieSeatsData,
        skipDuplicates: true,
      });
    });
  } catch (err) {
    console.log(err);
    throw new ServerApiError("DB Error: Failed to add movie to theatre", 401);
  }
}

export async function getMovies() {
  let movies = null;
  try {
    movies = await prisma.movie.findMany();
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to query movies", 500);
  }
  return movies;
}

export async function getTheatreMovies(theatreId: string) {
  let movies = null;
  try {
    movies = await prisma.theatreMovie.findMany({
      where: {
        theatreId: theatreId,
      },
    });
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to query movies", 500);
  }
  return movies;
}
