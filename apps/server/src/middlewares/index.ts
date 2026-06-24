import { apiJsonRseponse } from "@/utils";
import { auth } from "@movie-ticket-booking/auth";
import { ProfileType, type AuthenticatedRequest } from "@movie-ticket-booking/shared/types";
import z from "zod";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { ServerApiError } from "@/lib";

export async function authRequired(req: Request, res: Response, next: NextFunction) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  const user = session?.user;
  if (!session || !user) {
    return res.status(401).json(apiJsonRseponse(false, null, "Unauthorized user session"));
  }

  req.user = user;
  next();
}

export function validateCustomerRequestRole(req: Request, res: Response, next: NextFunction) {
  const request = req as AuthenticatedRequest;
  const user = request.user;
  if (!user.role || user.role !== ProfileType.CUSTOMER) {
    return res.json(apiJsonRseponse(false, null, "Unauthorized Request"));
  }
  next();
}

export function validateBusinessRequestRole(req: Request, res: Response, next: NextFunction) {
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
      const errors = [];
      for (let k in validationSchema) {
        const key = k as "params" | "body" | "query";
        const schema = validationSchema[key];
        if (schema) {
          const result = schema.safeParse(req[key]);
          if (!result.success) {
            const err = result.error.issues;
            errors.push(err);
          }
        }
      }

      if (errors.length > 0) {
        const missingFields: string[][] = [];
        errors.forEach((err) => {
          err.forEach((error) => {
            missingFields.push(error.path as string[]);
          });
        });
        throw new ServerApiError("Invalid request input", 401, {
          invalidInputFields: missingFields,
        });
      }
    } catch (err) {
      next(err);
    }
    next();
  };
}

export function apiErrorHandler(
  error: ServerApiError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  res.status(error.status).json(apiJsonRseponse(false, null, error.message, error.error));
}
