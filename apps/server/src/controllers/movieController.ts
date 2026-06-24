import { ServerApiError, stripe } from "@/lib";
import {
  createMovie,
  getMovieDetailsAndTheatres,
  getMovies,
  getTheatreMovieSeats,
} from "@/services/movieService";
import { createStripePaymentIntent } from "@/services/paymentService";
import { reserveTheatreMovieSeat } from "@/services/seatService";
import { apiJsonRseponse, convertIntoSmallestCurrencyUnit, minutesToSeconds } from "@/utils";
import redisClient from "@movie-ticket-booking/cache";
import { SEAT_RESERVATION_DURATION } from "@movie-ticket-booking/shared/constants";
import { CURRENCY, ProfileType } from "@movie-ticket-booking/shared/types";
import type { NextFunction } from "express";
import type { Request, Response } from "express";

export async function createMovieContoller(req: Request, res: Response, next: NextFunction) {
  try {
    const user = req.user;
    if (!user || !user.id) {
      throw new ServerApiError("Invalid user session req.user not found", 401);
    }

    let { title, description, rating, crew } = req.body;
    if (!rating) rating = 0;
    if (!crew) crew = {};
    const movieData = { title, description, rating, crew };
    const createdMovie = await createMovie(movieData);
    res.status(201).json(apiJsonRseponse(true, createdMovie, "Successfully created movie", null));
  } catch (err) {
    next(err);
  }
}

// TODO: add pagination and filters
export async function getMoviesController(req: Request, res: Response, next: NextFunction) {
  try {
    const movies = await getMovies();
    return res.status(200).json(apiJsonRseponse(true, movies, "Successfully fetched movies"));
  } catch (err) {
    next(err);
  }
}

export async function getMovieController(req: Request, res: Response, next: NextFunction) {
  try {
    const movieId = req.params.movieId as string;
    if (!movieId) throw new ServerApiError("Invalid movie id provided", 401);

    const movies = await getMovieDetailsAndTheatres(movieId);
    return res.status(200).json(apiJsonRseponse(true, movies, "Successfully fetched movies"));
  } catch (err) {
    next(err);
  }
}

export async function getTheatreMovieSeatsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const theatreMovieId = req.params.theatreMovieId as string;
    if (!theatreMovieId) throw new ServerApiError("Invalid theatre movie id provided", 401);

    const seats = await getTheatreMovieSeats(theatreMovieId);
    return res
      .status(200)
      .json(apiJsonRseponse(true, seats, "Successfully fetched theatre movie seats"));
  } catch (err) {
    next(err);
  }
}

export async function reserveMovieSeatController(req: Request, res: Response, next: NextFunction) {
  try {
    const theatreMovieId = req.params.theatreMovieId as string;
    const theatreMovieSeatId = req.params.theatreMovieSeatId as string;
    const user = req.user;
    if (!user || !user.id || user.role !== ProfileType.CUSTOMER) {
      throw new ServerApiError("Invalid session or invalid request by user", 401);
    }
    if (!theatreMovieId) throw new ServerApiError("Invalid theatre movie", 401);
    if (!theatreMovieSeatId) throw new ServerApiError("Invalid theatre movie seat", 401);

    res.send("reserving");

    // check redis for reservation
    const key = `seat:${theatreMovieSeatId}:`;
    const reservedForUserId: string | null = await redisClient.get(key);

    if (reservedForUserId) {
      // if reserved for same user who requested reservation then checkout to buy page
      if (reservedForUserId === user.id) {
        return res.status(200).json(
          apiJsonRseponse(
            true,
            {
              reservation: {
                reservedFor: user,
              },
            },
            "Seat already reserved for the user",
            200,
          ),
        );
      }
      // if reserved for another user return not available
      return res.status(200).json(apiJsonRseponse(false, {}, "Seat not available right now", 200));
    }

    // call reserve seat service
    const reservationSuccess = reserveTheatreMovieSeat(theatreMovieSeatId);

    // if seat couldn't be resesrved - gets reserved for another user -> return seat not available
    if (!reservationSuccess) {
      return res.status(200).json(
        apiJsonRseponse(
          true,
          {
            reservation: {
              reservedFor: user,
            },
          },
          "Seat already reserved for the user",
          200,
        ),
      );
    }

    // seat breserved successfully
    // update redis
    const expirationTime = minutesToSeconds(SEAT_RESERVATION_DURATION);
    await redisClient.set(key, user.id, "EX", expirationTime, "NX");

    // TODO: push to expire reservation queue (bullmq)
    // expire reservation worker: remove reservation entry -> update seat status to available (don't if seat is in SOLD state) -> remove redis entry

    return res
      .status(201)
      .json(apiJsonRseponse(true, { reservedFor: user }, "Seat successfully reserved", null));
  } catch (err) {
    next(err);
  }
}

export async function bookMovieSeatController(req: Request, res: Response, next: NextFunction) {
  try {
    // const theatreMovieId = req.params.theatreMovieId as string;
    const theatreMovieSeatId = req.params.theatreMovieSeatId;
    // if (!theatreMovieId)
    //   throw new ServerApiError("Invalid theatreMovieId", 401);
    if (!theatreMovieSeatId) throw new ServerApiError("Invalid theatreMovieSeatId", 401);

    // const paymentIntent = createStripePaymentIntent(500, CURRENCY.USD);
    // res.status(200).json({ paymentIntent });

    const amount = 2;
    const currency = CURRENCY.USD;
    const paymentIntent = await stripe.paymentIntents.create({
      // Amount value must be in the smallest currency unit (e.g., cents for USD)
      amount: convertIntoSmallestCurrencyUnit(amount, currency),
      currency: currency,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    res.status(200).json(paymentIntent);

    // verify user who's booking with the user who has reserved

    // implement proper payment system (look into it: idempotency key)

    // put in reserve seat route: generate a draft order row in orders during checkout and send it to user
    // get this orderId and check whether order is in process

    // make request for stripe intent

    // send client_secret to user

    // implement webhook route for stripe payment status
  } catch (err) {
    next(err);
  }
}

// TODO: handle booking of muliple seats
