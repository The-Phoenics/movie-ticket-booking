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

  req.user = user as unknown as Express.Request["user"];
  next();
}

function validateRole(user: AuthenticatedRequest["user"], role: ProfileType) {
  return user && user.role && user.role === role;
}

export function validateCustomerRole(req: Request, _res: Response, next: NextFunction) {
  const request = req as AuthenticatedRequest;
  if (!validateRole(request.user, ProfileType.CUSTOMER)) {
    throw new ServerApiError("Missing owner role", 401);
  }
  next();
}

export function validateOwnerRole(req: Request, _res: Response, next: NextFunction) {
  const request = req as AuthenticatedRequest;
  if (!validateRole(request.user, ProfileType.OWNER)) {
    throw new ServerApiError("Missing owner role", 401);
  }
  next();
}

export interface ValidationSchemaType {
  params?: z.ZodObject;
  body?: z.ZodObject;
  query?: z.ZodObject;
}

export function validateRequest(validationSchema: ValidationSchemaType) {
  return (req: Request, _res: Response, next: NextFunction) => {
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
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error.status === undefined) {
    console.error("Unknown error thrown:", error);
    res.status(500).json(apiJsonRseponse(false, null, "Internal Server Error"));
  } else {
    res.status(error.status).json(apiJsonRseponse(false, null, error.message, error.error));
  }
}
