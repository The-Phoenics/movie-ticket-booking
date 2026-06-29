import { createPrismaClient } from "@movie-ticket-booking/db";
import { env } from "@movie-ticket-booking/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { afterSignupHook, beforeSignupHook } from "./authHooks";

export function createAuth() {
  const prisma = createPrismaClient();

  return betterAuth({
    database: prismaAdapter(prisma, {
      provider: "postgresql",
    }),

    trustedOrigins: [env.CORS_ORIGIN],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 8,
    },
    secret: env.BETTER_AUTH_SECRET,
    baseURL: env.BETTER_AUTH_URL,
    advanced: {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
      },
    },
    plugins: [],
    hooks: {
      before: beforeSignupHook,
      after: afterSignupHook,
    },

    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          input: false,
          returned: true,
          defaultValue: "CUSTOMER",
        },
        isOnboarded: {
          type: "boolean",
          required: false,
          input: false,
          returned: true,
          defaultValue: false,
        },
      },
    },
  });
}

export const auth = createAuth();
