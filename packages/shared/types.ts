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
