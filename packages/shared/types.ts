export * from "../db/prisma/generated/client";
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
  id: string;
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
  id: string;
  original_title: string;
  overview: string;
  adult: boolean;
  original_language: string;
  release_date: Date;
  popularity: number;
  img: string;
}
