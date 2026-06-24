import express, { Router } from "express";
import {
  getMoviesController,
  getMovieController,
  getTheatreMovieSeatsController,
  reserveMovieSeatController,
  bookMovieSeatController,
} from "@/controllers/movieController";
import { authRequired, validateRequest, type ValidationSchemaType } from "@/middlewares";
import z from "zod";
import { createMovieContoller } from "@/controllers/movieController";

const CreateMovieRequestSchema: ValidationSchemaType = {
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    rating: z.number().min(0).optional(),
    crew: z.object().optional(),
  }),
};

const GetMovieValidationSchema: ValidationSchemaType = {
  params: z.object({
    movieId: z.string().min(1),
  }),
};

const GetTheatreMovieValidationSchema: ValidationSchemaType = {
  params: z.object({
    movieId: z.string().min(1),
    theatreMovieId: z.string().min(1),
  }),
};

const SeatReserveRequestSchema: ValidationSchemaType = {
  params: z.object({
    movieId: z.string(),
    theatreMovieId: z.string(),
    theatreMovieSeatId: z.string(),
  }),
};

const SeatBookRequestSchema: ValidationSchemaType = {
  params: z.object({
    movieId: z.string(),
    theatreMovieId: z.string(),
    theatreMovieSeatId: z.string(),
  }),
  body: z.object({
    currency: z.string(),
    amount: z.coerce.number(),
  }),
};

const moviesRouter: Router = express.Router();

// create movie
moviesRouter.post(
  "/",
  authRequired,
  validateRequest(CreateMovieRequestSchema),
  createMovieContoller,
);

moviesRouter.get("/", getMoviesController);

// get movie with available theatres with timing
moviesRouter.get("/:movieId", validateRequest(GetMovieValidationSchema), getMovieController);

// get theatre movie seats (seats reservation page)
moviesRouter.get(
  "/:movieId/:theatreMovieId",
  validateRequest(GetTheatreMovieValidationSchema),
  getTheatreMovieSeatsController,
);

moviesRouter.post(
  "/:movieId/:theatreMovieId/reserve/:theatreMovieSeatId",
  authRequired,
  validateRequest(SeatReserveRequestSchema),
  reserveMovieSeatController,
);

moviesRouter.post(
  "/:movieId/:theatreMovieId/book/:theatreMovieSeatId",
  validateRequest(SeatBookRequestSchema),
  bookMovieSeatController,
);

export default moviesRouter;
