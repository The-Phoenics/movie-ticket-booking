import express, { Router } from "express";
import {
  getMoviesController,
  getMovieController,
  getTheatreMovieSeatsController,
  reserveMovieSeatController,
  buyMovieSeatController,
  searchMovieController,
} from "@/controllers/movieController";
import { authRequired, validateRequest, type ValidationSchemaType } from "@/middlewares";
import z from "zod";
import { createMovieContoller } from "@/controllers/movieController";
import type { TMDBMovieSearchFilter } from "@movie-ticket-booking/shared/types";

const CreateMovieRequestSchema: ValidationSchemaType = {
  body: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    rating: z.number().min(0).optional(),
    crew: z.object().optional(),
    tags: z.array(z.string()).optional(),
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
    showId: z.string().min(1),
  }),
};

const SeatReserveRequestSchema: ValidationSchemaType = {
  params: z.object({
    movieId: z.string(),
    showId: z.string(),
    showSeatId: z.string(),
  }),
};

const SeatBookRequestSchema: ValidationSchemaType = {
  params: z.object({
    movieId: z.string(),
    showId: z.string(),
    showSeatId: z.string(),
  }),
  body: z.object({
    currency: z.string(),
    amount: z.coerce.number(),
  }),
};

const MovieSearchRequestSchema: ValidationSchemaType = {
  query: z.object({
    searchString: z.string(),
    adult: z.boolean().optional().default(true),
    page: z.number().optional().default(1),
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

moviesRouter.get("/search", validateRequest(MovieSearchRequestSchema), searchMovieController);

// get movie with available theatres with timing
moviesRouter.get("/:movieId", validateRequest(GetMovieValidationSchema), getMovieController);

// get theatre movie seats (seats reservation page)
moviesRouter.get(
  "/:movieId/:showId",
  validateRequest(GetTheatreMovieValidationSchema),
  getTheatreMovieSeatsController,
);

moviesRouter.post(
  "/:movieId/:showId/reserve/:showSeatId",
  authRequired,
  validateRequest(SeatReserveRequestSchema),
  reserveMovieSeatController,
);

moviesRouter.post(
  "/:movieId/:showId/book/:showSeatId",
  authRequired,
  validateRequest(SeatBookRequestSchema),
  buyMovieSeatController,
);

export default moviesRouter;
