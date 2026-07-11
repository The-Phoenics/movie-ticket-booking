import { ServerApiError } from "@/lib";
import { createTheatre, theatreNumOfSeats, addMovieToTheatre } from "@/services/ownerService";
import { getShows } from "@/services/movieService";
import { tmdbGetMovieById } from "@/services/tmdbMovieService";
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
    const tmdbMovieId = req.params.tmdbMovieId as string;

    const [tmdbMovie, theatreSeatsCount] = await Promise.all([
      tmdbGetMovieById(tmdbMovieId),
      theatreNumOfSeats(theatreId),
    ]);

    // check min seats in theatre
    if (theatreSeatsCount <= 0) {
      throw new ServerApiError("Add seats to theatre before adding movies", 401);
    }

    // check that the movies doesn't already exist
    if (!tmdbMovie) {
      throw new ServerApiError("Invalid tmdb movie id or movie already exist in this theatre", 401);
    }

    const createdMovie = await prisma.movie.upsert({
      create: { tmdbMovieId: tmdbMovieId, ...tmdbMovie },
      where: {
        tmdbMovieId: tmdbMovieId,
      },
      update: { ...tmdbMovie },
    });

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
    const theatreMovie = await addMovieToTheatre(
      theatreId,
      createdMovie.id,
      startTime,
      endTime,
      price,
    );
    res
      .status(201)
      .json(apiJsonRseponse(true, { theatreMovie }, "Successfully added movie to theatre", null));
  } catch (err) {
    next(err);
  }
}

export async function getShowController(req: Request, res: Response, next: NextFunction) {
  // TODO: create a valiate theatre request reusable function to verify if theatre is valid or not
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
    const movies = await getShows(theatreId);
    res.status(200).json(apiJsonRseponse(true, movies, "Successfully fetched movies"));
  } catch (err) {
    next(err);
  }
}
