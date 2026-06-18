import express, { Router } from "express";
import prisma from "@movie-ticket-booking/db";
import { auth } from "@movie-ticket-booking/auth";
import { fromNodeHeaders } from "better-auth/node";
import { apiJsonRseponse } from "../utils";
import {
  bookCustomerSeatController,
  reserveCustomerSeatController,
} from "@/controllers/customerController";
import { validateRequest, type ValidationSchemaType } from "@/middlewares";
import z from "zod";

const customerRouter: Router = express.Router();

const SeatReserveRequestSchema: ValidationSchemaType = {
  params: z.object({
    theatreMovieId: z.string().min(1),
    theatreMovieSeatId: z.string().min(1),
  }),
};

const BookReserveRequestSchema = SeatReserveRequestSchema;

customerRouter.get("/", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const user = session?.user;
  if (!session || !user) {
    return res
      .status(401)
      .json(apiJsonRseponse(false, null, "Unauthorized user session"));
  }

  const customer = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      customer: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!customer || !customer.customer) {
    return res.status(404).json(apiJsonRseponse(false, null, "User not found"));
  }

  return res
    .status(200)
    .json(apiJsonRseponse(true, customer, "User fetched successfully"));
});

customerRouter.patch("/", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });
  const user = session?.user;
  if (!session || !user) {
    return res
      .status(401)
      .json(apiJsonRseponse(false, null, "Unauthorized user session"));
  }

  const { name } = req.body as { name?: string };
  const updateData: { name?: string } = {};

  if (name !== undefined) {
    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json(apiJsonRseponse(false, null, "Invalid name"));
    }
    updateData.name = name.trim();
  }

  if (Object.keys(updateData).length === 0) {
    return res
      .status(400)
      .json(apiJsonRseponse(false, null, "No valid fields to update"));
  }

  const updatedUser = await prisma.customer.update({
    where: { userId: user.id },
    data: updateData,
  });

  if (!updatedUser) {
    return res
      .status(401)
      .json(apiJsonRseponse(false, null, "Invalid user data input"));
  }

  return res
    .status(200)
    .json(apiJsonRseponse(true, updatedUser, "User updated successfully"));
});

customerRouter.post(
  "/:theatreMovieId/:theatreMovieSeatId/reserve",
  validateRequest(SeatReserveRequestSchema),
  reserveCustomerSeatController,
);

customerRouter.post(
  "/:theatreMovieId/:theatreMovieSeatId/book",
  validateRequest(BookReserveRequestSchema),
  bookCustomerSeatController,
);

export default customerRouter;
