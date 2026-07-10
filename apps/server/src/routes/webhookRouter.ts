import { ServerApiError, stripe } from "@/lib";
import { env } from "@movie-ticket-booking/env/server";
import sendTicketJob from "@movie-ticket-booking/queue";
import express, { Router } from "express";

const webhookRouter: Router = express.Router();

webhookRouter.use(
  express.raw({
    type: "application/json",
  }),
);

interface PaymentEventMetadata {
  customerId: string
  orderId: string
  showSeatId: string
}

webhookRouter.post("/stripe", async (req, res) => {
  // validate webhook request
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;
  const signature = req.headers["stripe-signature"] as string;

  // verify request
  let event = null;
  try {
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(req.body || "");
    event = await stripe.webhooks.constructEventAsync(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error(
      "Payment Webhook Error: Stripe webhook request signature verification failed:",
      err.message,
    );
    throw new ServerApiError("Webhook secret verification failed", 400);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      // handle payment succeeded
      const paymentTicketInfo: PaymentEventMetadata = event.data.object.metadata
      
      // sendTicketJob()
      console.log("In evnet handler:", event.type);
      break;
    case "payment_intent.payment_failed":
      // handle payment failed
      console.log("In evnet handler:", event.type);
      break;
    case "checkout.session.completed":
      // handle payment succeeded
      console.log("In evnet handler:", event.type);
      break;
    default:
      console.log(`Payment Webhook: Unhandled event type ${event.type}.`);
  }
  res.status(200);
});

export default webhookRouter;
