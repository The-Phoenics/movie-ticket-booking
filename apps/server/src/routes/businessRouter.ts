import express, { Router } from "express";
import { createTheatreContoller } from "@/controllers/businessController";
import { validateRequest, type ValidationSchemaType } from "@/middlewares";
import z from "zod";

const businessRouter: Router = express.Router();

const CreateTheatreRequestSchema: ValidationSchemaType = {
  params: z.object({
    name: z.string(),
  }),
};

businessRouter.post(
  "/theatre/create",
  validateRequest(CreateTheatreRequestSchema),
  createTheatreContoller,
);

// businessRouter.get("/movies", controller);
// businessRouter.get("/movies/create", controller);
// businessRouter.get("/movies/add", controller);

// businessRouter.get("/seats/add", controller);
export default businessRouter;
