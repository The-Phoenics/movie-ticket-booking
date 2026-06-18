import express, { Router } from "express";
import {
  addMovieToTheatreController,
  createTheatreContoller,
  getTheatreMoviesController,
} from "@/controllers/businessController";
import { validateRequest, type ValidationSchemaType } from "@/middlewares";
import z from "zod";
import {
  createSeatsController,
  deleteSeatsController,
} from "@/controllers/seatController";

const businessRouter: Router = express.Router();

const CreateTheatreRequestSchema: ValidationSchemaType = {
  body: z.object({
    title: z.string(),
    address: z.string().min(1),
    city: z.string(),
    country: z.string(),
  }),
};

const CreateSeatsRequestSchema: ValidationSchemaType = {
  body: z.object({
    seats: z.array(
      z.object({
        row: z.string().min(1).max(1),
        col: z.number().min(1),
      }),
    ),
  }),
  params: z.object({
    theatreId: z.string().min(1),
  }),
};

const DeleteSeatsRequestSchema = CreateSeatsRequestSchema;

const AddMovieToTheatre: ValidationSchemaType = {
  body: z.object({
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    price: z.number().min(0),
  }),
  params: z.object({
    theatreId: z.string().min(1),
    movieId: z.string().min(1),
  }),
};

// create theatre
businessRouter.post(
  "/theatres",
  validateRequest(CreateTheatreRequestSchema),
  createTheatreContoller,
);

// create seats for theatre in bulk
businessRouter.post(
  "/:theatreId/seats",
  validateRequest(CreateSeatsRequestSchema),
  createSeatsController,
);

// delete seats for theatre in bulk
businessRouter.delete(
  "/:theatreId/seats",
  validateRequest(DeleteSeatsRequestSchema),
  deleteSeatsController,
);

// add movie to theatre
businessRouter.post(
  "/:theatreId/add/:movieId",
  validateRequest(AddMovieToTheatre),
  addMovieToTheatreController,
);

// get theatre movies
businessRouter.get("/:theatreId/movies", getTheatreMoviesController);

export default businessRouter;
