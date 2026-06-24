import { env } from "@movie-ticket-booking/env/server";
import Stripe from "stripe";

// export enum ServerApiErrorType {
//   VALIDATION_ERROR,
//   SERVICE_ERROR,
// }

export class ServerApiError extends Error {
  public message: string;
  public status: number;

  constructor(message: string, status: number, error: any = null) {
    super(message);
    this.message = message;
    this.status = status;
    console.log("Error: ", error)
  }
}

function createStripeInstance() {
  try {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);
    return stripe;
  } catch (err) {
    console.log("Server error: Failed to create stripe instance", err);
    throw new Error("Server error: Failed to create stripe instance");
  }
}

const stripe = createStripeInstance();
export { stripe };
