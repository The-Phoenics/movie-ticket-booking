import { ServerApiError, stripe } from "@/lib";
import {
  createMovie,
  getMovieDetailsAndTheatres,
  getMovies,
  getShowSeats,
} from "@/services/movieService";
import {
  reserveTheatreMovieSeat,
  verifySeatReservationForUser,
} from "@/services/seatService";
import {
  apiJsonRseponse,
  convertIntoSmallestCurrencyUnit,
  minutesToSeconds,
} from "@/utils";
import redisClient from "@movie-ticket-booking/cache";
import prisma from "@movie-ticket-booking/db";
import { SEAT_RESERVATION_DURATION } from "@movie-ticket-booking/shared/constants";
import {
  CURRENCY,
  ORDER_STATUS,
  PAYMENT_PROVIDER,
  ProfileType,
} from "@movie-ticket-booking/shared/types";
import type { NextFunction } from "express";
import type { Request, Response } from "express";

export async function createMovieContoller(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user;
    if (!user || !user.id) {
      throw new ServerApiError("Invalid user session req.user not found", 401);
    }

    let { title, description, rating, crew, tags } = req.body;
    if (!rating) rating = 0;
    if (!crew) crew = {};
    const movieData = { title, description, rating, crew, tags };
    const createdMovie = await createMovie(movieData);
    res
      .status(201)
      .json(
        apiJsonRseponse(true, createdMovie, "Successfully created movie", null),
      );
  } catch (err) {
    next(err);
  }
}

// TODO: add pagination and filters
export async function getMoviesController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const movies = await getMovies();
    return res
      .status(200)
      .json(apiJsonRseponse(true, movies, "Successfully fetched movies"));
  } catch (err) {
    next(err);
  }
}

export async function getMovieController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const movieId = req.params.movieId as string;
    if (!movieId) throw new ServerApiError("Invalid movie id provided", 401);

    const movies = await getMovieDetailsAndTheatres(movieId);
    return res
      .status(200)
      .json(apiJsonRseponse(true, movies, "Successfully fetched movies"));
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
    const showId = req.params.showId as string;
    if (!showId)
      throw new ServerApiError("Invalid theatre movie id provided", 401);

    const theatreMovie = await prisma.show.findUnique({
      where: { id: showId },
    });
    if (!theatreMovie)
      throw new ServerApiError("Invalid theatre movie id provided", 401);

    const seats = await getShowSeats(showId);
    return res
      .status(200)
      .json(
        apiJsonRseponse(
          true,
          seats,
          "Successfully fetched theatre movie seats",
        ),
      );
  } catch (err) {
    next(err);
  }
}

export async function reserveMovieSeatController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const showId = req.params.showId as string;
    const showSeatId = req.params.showSeatId as string;
    const user = req.user;
    if (!user || !user.id || user.role !== ProfileType.CUSTOMER) {
      throw new ServerApiError(
        "Invalid session or invalid request by user",
        401,
      );
    }
    if (!showId) throw new ServerApiError("Invalid theatre movie", 401);
    if (!showSeatId)
      throw new ServerApiError("Invalid theatre movie seat", 401);

    const customer = await prisma.customer.findUnique({
      where: { userId: user.id },
    });
    if (!customer) {
      throw new ServerApiError(
        "Unauthorized user making request to buy ticket",
        402,
      );
    }

    // check redis for reservation
    const key = `seat:${showSeatId}:`;
    const reservedForUserId: string | null = await redisClient.get(key);

    if (reservedForUserId) {
      // if reserved for same user who requested reservation then checkout to buy page
      if (reservedForUserId === customer.id) {
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
      return res
        .status(200)
        .json(apiJsonRseponse(false, {}, "Seat not available right now", 200));
    }

    // call reserve seat service
    const reservationSuccess = reserveTheatreMovieSeat(customer.id, showSeatId);

    // if seat couldn't be resesrved - gets reserved for another user -> return seat not available
    if (!reservationSuccess) {
      return res.status(200).json(
        apiJsonRseponse(
          true,
          {
            reservation: {
              reservedFor: customer,
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
    await redisClient.set(key, customer.id, "EX", expirationTime, "NX");

    // TODO: push to expire reservation queue (bullmq)
    // expire reservation worker: remove reservation entry -> update seat status to available (don't if seat is in SOLD state) -> remove redis entry

    return res
      .status(201)
      .json(
        apiJsonRseponse(
          true,
          { reservedFor: user },
          "Seat successfully reserved",
          null,
        ),
      );
  } catch (err) {
    next(err);
  }
}

export async function buyMovieSeatController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const showId = req.params.showId as string;
    const showSeatId = req.params.showSeatId as string;
    if (!showId) throw new ServerApiError("Invalid showId", 401);
    if (!showSeatId) throw new ServerApiError("Invalid showSeatId", 401);

    const amount = Number.parseInt(req.body.amount);
    const currency = req.body.currency as CURRENCY;
    if (!amount || isNaN(amount))
      throw new ServerApiError("Invalid amount input", 401);
    if (!currency) throw new ServerApiError("Invalid currency input", 401);

    const user = req.user;
    if (!user || !user.id) {
      throw new ServerApiError(
        "Unauthorized user making request to buy ticket",
        402,
      );
    }

    // verify user who's booking with the user who has reserved
    const customer = await prisma.customer.findUnique({
      where: { userId: user.id },
    });
    if (!customer) {
      throw new ServerApiError(
        "Unauthorized user making request to buy ticket",
        402,
      );
    }
    const verified = verifySeatReservationForUser(customer.id, showSeatId);
    if (!verified) {
      throw new ServerApiError(
        "Seat is reserved for the user trying to buy the seat",
        401,
      );
    }

    // create draft order and payment with pending states, store payment providers id
    const result = await prisma.order.create({
      data: {
        status: ORDER_STATUS.PENDING,
        customerId: customer.id,
        showSeatId: showSeatId,
        payment: {
          create: {
            amount: amount,
            currency: currency,
            paymentId: "", // update later
            paymentProvider: PAYMENT_PROVIDER.STRIPE,
          },
        },
      },
    });

    // create payment intent
    let paymentIntent = null;
    try {
      paymentIntent = await stripe.paymentIntents.create(
        {
          // Amount value must be in the smallest currency unit (e.g., cents for USD)
          amount: convertIntoSmallestCurrencyUnit(amount, currency),
          currency: currency,
          automatic_payment_methods: {
            enabled: true,
          },
          metadata: {
            customerId: result.customerId,
            orderId: result.id,
            showSeatId: showSeatId,
          },
        },
        {
          idempotencyKey: result.id,
        },
      );
    } catch (err) {
      console.log("error:", err);
      throw new ServerApiError(
        "Failed to create payment intent to buy ticket with order.id: " +
          result.id,
        500,
        err,
      );
    }

    // udpate order payment table with payment intent id: this id will be used to update
    await prisma.order.update({
      where: {
        id: result.id,
      },
      data: {
        payment: {
          update: {
            data: {
              paymentId: paymentIntent.id,
            },
          },
        },
      },
    });

    return res.status(200).json(
      apiJsonRseponse(true, {
        clientSecret: paymentIntent.client_secret,
        orderId: result.id,
      }),
    );
  } catch (err) {
    console.log("Error booking movie seat: ", err);
    next(err);
  }
}

// TODO: handle booking of muliple seats

// TODO: movie search api
export async function searchMovieController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const searchQueryString = req.query.q as string;
    const genreQueryString = req.query.genre as string;
    const sortByQueryString = req.query.sortBy as string;

    // return res.status(200).json(
    //   apiJsonRseponse(true, {
    //     clientSecret: paymentIntent.client_secret,
    //     orderId: result.id,
    //   }),
    // );
  } catch (err) {
    console.log("Error booking movie seat: ", err);
    next(err);
  }
}
