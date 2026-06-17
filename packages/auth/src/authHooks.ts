import { createAuthMiddleware } from "better-auth/api";
import { type User, ProfileType } from "@movie-ticket-booking/shared/types";

export const afterSignupHook = createAuthMiddleware(async (ctx) => {
  if (ctx.path.startsWith("/sign-up/email")) {
    // create user type table
    const user = ctx.body as User;
    
  }
});

export const beforeSignupHook = createAuthMiddleware(async (ctx) => {
  if (ctx.path.startsWith("/sign-up/email")) {
    // ...
  }
});
