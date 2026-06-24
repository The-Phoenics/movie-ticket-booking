import { stripe } from "@/lib";
import express, { Router } from "express";

const webhookRouter: Router = express.Router();

webhookRouter.use(
  express.raw({
    type: "application/json",
  }),
);

webhookRouter.post("/stripe", (req, res) => {
    // validate webhook request
    const data = req.body
    console.log(JSON.parse(data))
    // stripe.webhooks.constructEvent();



});

export default webhookRouter;
