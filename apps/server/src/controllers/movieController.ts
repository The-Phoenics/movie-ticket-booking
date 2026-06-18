import { ServerApiError } from "@/lib";
import { createMovie, getMovieDetailsAndTheatres, getMovies, getTheatreMovieSeats } from "@/services/movieService";
import { apiJsonRseponse } from "@/utils";
import type { NextFunction } from "express";
import type { Request, Response } from "express";

export async function createMovieContoller(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user;
    if (!user || !user.id) {
      throw new ServerApiError("Invalid user session req.user not found", 401);
    }

    let { title, description, rating, crew } = req.body;
    if (!rating) rating = 0;
    if (!crew) crew = {};
    const movieData = { title, description, rating, crew };
    const createdMovie = await createMovie(movieData);
    res
      .status(201)
      .json(
        apiJsonRseponse(true, createdMovie, "Successfully created movie", null),
      );
  } catch (err) {
    next(err);
  }
}

// TODO: add pagination and filters
export async function getMoviesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const movies = await getMovies();
    return res
      .status(200)
      .json(apiJsonRseponse(true, movies, "Successfully fetched movies"));
  } catch (err) {
    next(err);
  }
}

export async function getMovieController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const movieId = req.params.movieId as string;
    if (!movieId) throw new ServerApiError("Invalid movie id provided", 401)

    const movies = await getMovieDetailsAndTheatres(movieId);
    return res
      .status(200)
      .json(apiJsonRseponse(true, movies, "Successfully fetched movies"));
  } catch (err) {
    next(err);
  }
}

export async function getTheatreMovieSeatsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const theatreMovieId = req.params.theatreMovieId as string;
    if (!theatreMovieId) throw new ServerApiError("Invalid theatre movie id provided", 401)

    const seats = await getTheatreMovieSeats(theatreMovieId);
    return res
      .status(200)
      .json(apiJsonRseponse(true, seats, "Successfully fetched theatre movie seats"));
  } catch (err) {
    next(err);
  }
}