export type {
  User,
  Session,
  Account,
  Verification,
  Customer,
  Theatre,
  Movie,
  Show,
  Seat,
  ShowSeat,
  ShowSeatReservation,
  Ticket,
  Order,
  Payment,
} from "../db/prisma/generated/client";

export type {
  ProfileType,
  SEAT_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  CURRENCY,
  PAYMENT_PROVIDER,
  MOVIE_TAG,
  Region,
} from "../db/prisma/generated/enums";

import * as PrismaTypes from "../db/prisma/generated/client";

import type { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: PrismaTypes.User;
    }
  }
}

export type AuthenticatedRequest = Request & {
  user: PrismaTypes.User;
};

export enum QUEUE_TYPE {
  SEND_TICKET_QUEUE = "send-ticket-queue",
  // EMAIL_QUEUE
}

//
export type SendTicketJobDataType = {
  orderId: string;
  showSeatId: string;
};

// tmdb types
export interface TMDBMovieSearchFilter {
  searchString: string;
  adult: boolean;
  page: number;
}

export interface TMDBMovieType {
  id: number;
  title: string;
  overview: string;
  adult: boolean;
  original_language: string;
  release_date: Date;
  popularity: number;
  status: string;
  tagline: string;
  vote_average: number;
  genres: {
    id: number;
    name: string;
  }[];
  img: string;
}

export interface TMDBMoviesType {
  id: number;
  original_title: string;
  overview: string;
  adult: boolean;
  original_language: string;
  release_date: Date;
  popularity: number;
  img: string;
  vote_average: number;
}
