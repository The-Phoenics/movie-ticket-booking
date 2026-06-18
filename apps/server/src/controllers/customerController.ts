import { ServerApiError } from "@/lib";
import type { Request, Response, NextFunction } from "express";

export async function reserveCustomerSeatController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const theatreMovieId = req.params.theatreMovieId as string;
    const theatreMovieSeatId = req.params.theatreMovieSeatId;
    if (!theatreMovieId)
      throw new ServerApiError("Invalid theatreMovieId", 401);
    if (!theatreMovieSeatId)
      throw new ServerApiError("Invalid theatreMovieSeatId", 401);

    // check redis for reservation

    // if reserved for same user who requested reservation then checkout to buy page

    // if reserved for another user return not available

    // call reserve seat service

    // if seat couldn't be resesrved - gets reserved for another user -> return seat not available

    // reserved successfully -> push to expire reservation queue (bullmq) ->  update redis

        // expire reservation worker: remove reservation entry -> update seat status to available (don't if seat is in SOLD state) -> remove redis entry

  } catch (err) {
    next(err);
  }
}

export async function bookCustomerSeatController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const theatreMovieId = req.params.theatreMovieId as string;
    const theatreMovieSeatId = req.params.theatreMovieSeatId;
    if (!theatreMovieId)
      throw new ServerApiError("Invalid theatreMovieId", 401);
    if (!theatreMovieSeatId)
      throw new ServerApiError("Invalid theatreMovieSeatId", 401);

    // verify user who's booking with the user who has reserved

    // implement proper payment system (look into it: idempotency key)

  } catch (err) {
    next(err);
  }
}
