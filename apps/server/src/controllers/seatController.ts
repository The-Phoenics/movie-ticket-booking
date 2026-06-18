import { ServerApiError } from "@/lib";
import { createSeatsBulk, deleteSeatsBulk } from "@/services/seatService";
import { apiJsonRseponse } from "@/utils";
import prisma from "@movie-ticket-booking/db";
import type { NextFunction, Request, Response } from "express";

export async function createSeatsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user;
    const theatreId = req.params.theatreId as string;
    if (!user || !user.id || !theatreId) {
      throw new ServerApiError("Invalid user session req.user not found", 401);
    }

    const theatre = await prisma.theatre.findUnique({
      where: {
        id: theatreId,
        userId: user.id,
      },
    });
    if (!theatre) {
      throw new ServerApiError("Invalid theatre, theatreId not found", 401);
    }

    const seats = req.body.seats;
    const created = await createSeatsBulk(seats, theatreId);
    res
      .status(201)
      .json(
        apiJsonRseponse(
          true,
          created,
          `Successfully created seats for theatre: \"${theatre.title}\"`,
          null,
        ),
      );
  } catch (err) {
    next(err);
  }
}

export async function deleteSeatsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user;
    const theatreId = req.params.theatreId as string;
    if (!user || !user.id || !theatreId) {
      throw new ServerApiError("Invalid user session req.user not found", 401);
    }

    const theatre = await prisma.theatre.findUnique({
      where: {
        id: theatreId,
        userId: user.id,
      },
    });
    if (!theatre) {
      throw new ServerApiError("Invalid theatre, theatreId not found", 401);
    }

    const seats = req.body.seats;
    await deleteSeatsBulk(seats, theatreId);
    res
      .status(204)
      .json(
        apiJsonRseponse(
          true,
          null,
          `Successfully deleted seats for theatre: \"${theatre.title}\"`,
          null,
        ),
      );
  } catch (err) {
    next(err);
  }
}
