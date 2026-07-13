// export prisma generated types
export * from "../db/prisma/generated/client";
export * from "../db/prisma/generated/enums";
export * from "../db/prisma/generated/internal/prismaNamespace";

import { type User } from "../db/prisma/generated/client";
import { type Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export type AuthenticatedRequest = Request & {
  user: User;
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
}
