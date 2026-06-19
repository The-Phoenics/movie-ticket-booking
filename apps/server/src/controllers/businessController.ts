import { ServerApiError } from "@/lib";
import { createTheatre, theatreNumOfSeats, addMovieToTheatre } from "@/services/businessService";
import { getTheatreMovies } from "@/services/movieService";
import { apiJsonRseponse, isValidDateInstance } from "@/utils";
import prisma from "@movie-ticket-booking/db";
import type { NextFunction, Request, Response } from "express";

export async function createTheatreContoller(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user || !user.id) {
      throw new ServerApiError("Invalid user session req.user not found", 401);
    }

    const userId = user.id;
    const { title, address, city, country } = req.body;
    const theatreData = { title, userId, address, city, country };
    const created = await createTheatre(theatreData);
    res.status(201).json(apiJsonRseponse(true, created, "Successfully created theatre", null));
  } catch (err) {
    next(err);
  }
}

export async function addMovieToTheatreController(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user || !user.id) {
      throw new ServerApiError("Invalid user session req.user not found", 401);
    }

    const theatreId = req.params.theatreId as string;
    const movieId = req.params.movieId as string;

    const [theatreSeatsCount, movie] = await Promise.all([
      theatreNumOfSeats(theatreId),
      prisma.movie.findUnique({ where: { id: movieId } }),
    ]);

    // check min seats in theatre
    if (theatreSeatsCount <= 0) {
      throw new ServerApiError("Add seats to theatre before adding movies", 401);
    }

    // check if movie exists
    if (!movie) throw new ServerApiError(`Invalid movie. Movie not found with id: ${movieId}`, 404);

    const startTime = new Date(req.body.startTime);
    const endTime = new Date(req.body.endTime);
    if (!isValidDateInstance(startTime) || !isValidDateInstance(endTime) || startTime > endTime) {
      throw new ServerApiError("Invalid movie start or end date", 401);
    }

    const price = Number(req.body.price);
    if (!price || isNaN(price)) {
      throw new ServerApiError("Invalid movie ticket price value", 401);
    }

    // add movie to theatre
    const theatreMovie = await addMovieToTheatre(theatreId, movieId, startTime, endTime, price);
    res
      .status(201)
      .json(apiJsonRseponse(true, { theatreMovie }, "Successfully added movie to theatre", null));
  } catch (err) {
    next(err);
  }
}

export async function getTheatreMoviesController(req: Request, res: Response, next: NextFunction) {
  // TODO: create a valiate theatre request function to match user and theatre and sent theatreId
  const theatreId = req.params.theatreId as string;
  if (!theatreId) {
    res.status(404).json(apiJsonRseponse(false, null, "Invalid theatre id"));
  }

  const theatre = await prisma.theatre.findUnique({
    where: {
      id: theatreId,
    },
  });
  if (!theatre) res.status(404).json(apiJsonRseponse(false, null, "Invalid theatre id"));

  try {
    const movies = await getTheatreMovies(theatreId);
    res.status(200).json(apiJsonRseponse(true, movies, "Successfully fetched movies"));
  } catch (err) {
    next(err);
  }
}
