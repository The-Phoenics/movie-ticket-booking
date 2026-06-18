import express, { Router } from "express";
import {
  getMoviesController,
  getMovieController,
  getTheatreMovieSeatsController,
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
      theatreMovieId: z.string().min(1)
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
moviesRouter.get(
  "/:movieId",
  validateRequest(GetMovieValidationSchema),
  getMovieController,
);

moviesRouter.get(
  "/:movieId/:theatreMovieId",
  validateRequest(GetTheatreMovieValidationSchema),
  getTheatreMovieSeatsController,
);

export default moviesRouter;
