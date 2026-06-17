import { apiJsonRseponse } from "@/utils";
import { auth } from "@movie-ticket-booking/auth";
import {
  ProfileType,
  type AuthenticatedRequest,
} from "@movie-ticket-booking/shared/types";
import z from "zod";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

export async function authRequired(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const user = session?.user;
  if (!session || !user) {
    return res
      .status(401)
      .json(apiJsonRseponse(false, null, "Unauthorized user session"));
  }

  req.user = user;
  next();
}

export function validateCustomerRequestRole(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = req as AuthenticatedRequest;
  const user = request.user;
  if (!user.role || user.role !== ProfileType.CUSTOMER) {
    return res.json(apiJsonRseponse(false, null, "Unauthorized Request"));
  }
  next();
}

export function validateBusinessRequestRole(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const request = req as AuthenticatedRequest;
  const user = request.user;
  if (!user.role || user.role !== ProfileType.BUSINESS) {
    return res.json(apiJsonRseponse(false, null, "Unauthorized Request"));
  }
  next();
}

export interface ValidationSchemaType {
  params?: z.ZodObject;
  body?: z.ZodObject;
  query?: z.ZodObject;
}

export function validateRequest(validationSchema: ValidationSchemaType) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (validationSchema.params) {
        validationSchema.params.parse(req.params);
      }
      if (validationSchema.body) {
        validationSchema.body.parse(req.params);
      }
      if (validationSchema.query) {
        validationSchema.query.parse(req.params);
      }
    } catch (err) {
      next(err);
    }
    next();
  };
}

export function apiErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log("Error handler middleware error:", error);
  next(error);
}
