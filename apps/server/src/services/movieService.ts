import { ServerApiError } from "@/lib";
import prisma from "@movie-ticket-booking/db";
import type { TheatreMovie } from "@movie-ticket-booking/shared/types";
import type { MovieCreateInput } from "../../../../packages/db/prisma/generated/internal/prismaNamespace";

export async function createMovie(movieData: MovieCreateInput) {
  try {
    const movie = await prisma.movie.create({
      data: {
        ...movieData,
      },
    });
    return {
      movie,
    };
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to create theatre", 501);
  }
}

export async function getMovies() {
  try {
    const movies = await prisma.movie.findMany();
    return {
      movies,
    };
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to query movies", 500);
  }
}

// get movies details and all the theatres list where movies is available
export async function getMovieDetailsAndTheatres(movieId: string) {
  try {
    const [movie, theatreMovie] = await Promise.all([
      prisma.movie.findUnique({
        where: {
          id: movieId,
        },
      }),
      prisma.theatreMovie.findMany({
        where: {
          movieId: movieId,
        },
      }),
    ]);
    const theatres = theatreMovie.sort((th1: TheatreMovie, th2: TheatreMovie) => {
      if (th1.startTime < th2.startTime) return 1;
      return -1;
    });
    return {
      movie: { ...movie },
      theatres: theatres,
    };
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to query movie details", 500);
  }
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

// get movies details and all the theatres list where movies is available
export async function getTheatreMovieSeats(theatreMovieId: string) {
  try {
    const seats = await prisma.theatreMovieSeat.findMany({
      where: {
        theatreMovieId: theatreMovieId,
      },
      include: {
        seat: {
          select: {
            id: true,
            row: true,
            col: true,
          },
        },
      },
    });
    return {
      theatreMovieSeatsData: seats,
    };
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to query movie details", 500, err);
  }
}
