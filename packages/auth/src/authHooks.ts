import { createAuthMiddleware } from "better-auth/api";

export const afterSignupHook = createAuthMiddleware(async (_ctx) => {
  // no-op
});

export const beforeSignupHook = createAuthMiddleware(async (_ctx) => {
  // no-op
});
