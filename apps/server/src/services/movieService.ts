import { ServerApiError } from "@/lib";
import prisma from "@movie-ticket-booking/db";
import type { Theatre, TheatreMovie } from "@movie-ticket-booking/shared/types";
import type { MovieCreateInput } from "../../../../packages/db/prisma/generated/internal/prismaNamespace";
import { format } from "date-fns";

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
        include: {
          theatre: true,
        },
      }),
    ]);

    const theatreMovies = theatreMovie.sort((th1: TheatreMovie, th2: TheatreMovie) => {
      if (th1.startTime < th2.startTime) return 1;
      return -1;
    });

    const data: any = {};
    const dates: string[] = [];
    theatreMovies.forEach((tm) => {
      const formattedDayString = format(tm.startTime, "dd MMMM yyyy");
      if (!dates.includes(formattedDayString)) dates.push(formattedDayString);
    });

    dates.forEach((day) => {
      const theatreWithTimings: any = {};
      theatreMovies.forEach((tm) => {
        const formattedDayString = format(tm.startTime, "dd MMMM yyyy");
        if (day === formattedDayString) {
          const thId = tm.theatreId;
          const theatre = theatreWithTimings[thId];
          if (!theatre) {
            theatreWithTimings[thId] = {
              theatreData: tm.theatre,
              dates: [{ start: tm.startTime, end: tm.endTime, theatreMovieId: tm.id }],
            };
          } else {
            const dates = theatre.dates;
            dates.push({ start: tm.startTime, end: tm.endTime, theatreMovieId: tm.id });
            theatreWithTimings[thId].dates = dates;
          }
        }
      });
      data[day] = theatreWithTimings;
    });

    return {
      movie: { ...movie },
      datesWithTheatreTimings: data,
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
    // TODO: Also return the user with seat for whom the seat is reserved, so frontend won't show the seat as reserved the user for whom its already reserved

    return {
      theatreMovieSeatsData: seats,
    };
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to query movie details", 500, err);
  }
}
