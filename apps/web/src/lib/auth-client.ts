import { env } from "@movie-ticket-booking/env/web";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@movie-ticket-booking/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_SERVER_URL,
  plugins: [inferAdditionalFields<typeof auth>()],
});
