import express, { Router } from "express";
import {
  addMovieToTheatreController,
  createTheatreContoller,
  getShowController,
} from "@/controllers/ownerController";
import { validateRequest, type ValidationSchemaType } from "@/middlewares";
import z from "zod";
import {
  createSeatsController,
  deleteSeatsController,
} from "@/controllers/seatController";

const ownerRouter: Router = express.Router();

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
    tmdbMovieId: z.string().min(1),
  }),
};

// create theatre
ownerRouter.post(
  "/theatres",
  validateRequest(CreateTheatreRequestSchema),
  createTheatreContoller,
);

// create seats for theatre in bulk
ownerRouter.post(
  "/:theatreId/seats",
  validateRequest(CreateSeatsRequestSchema),
  createSeatsController,
);

// delete seats for theatre in bulk
ownerRouter.delete(
  "/:theatreId/seats",
  validateRequest(DeleteSeatsRequestSchema),
  deleteSeatsController,
);

// add movie to theatre
ownerRouter.post(
  "/:theatreId/add/:movieId",
  validateRequest(AddMovieToTheatre),
  addMovieToTheatreController,
);

// get theatre movies
ownerRouter.get("/:theatreId/movies", getShowController);

export default ownerRouter;
