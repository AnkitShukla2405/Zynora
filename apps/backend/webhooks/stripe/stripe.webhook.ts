import Stripe from "stripe";
import { Request, Response } from "express";

import { handlePaymentSuccess } from "../../services/stripe/handlePaymentSucess";
import { handlePaymentFailure } from "../../services/stripe/handlePaymentFailure";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const stripeWebhookHandler = async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"] as string;

  if (!signature) {
    return res.status(400).send("Missing Stripe signature");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res.status(400).send("Webhook Error");
  }

  try {
    console.log("Webhook received:", event.type);

    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent);
        break;

      case "payment_intent.payment_failed":
      case "payment_intent.canceled":
        await handlePaymentFailure(event.data.object as Stripe.PaymentIntent);
        break;
    }
  } catch (err) {
    console.error("Webhook processing failed:", err);
    return res.status(500).send("Processing failed");
  }

  res.status(200).send("OK");
};