const express = require("express");
const Stripe = require("stripe");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a PaymentIntent (client_secret returned to client)
router.post("/setup-intent", async (req, res) => {
  try {
    const { customerId } = req.body; // create or reuse a Stripe customer id
    const customer = customerId || (await stripe.customers.create()).id;

    const si = await stripe.setupIntents.create({
      customer,
      usage: "off_session", // you plan to charge later, when user may be absent
      payment_method_types: ["card"], // default, but explicit is fine
    });

    res.json({ clientSecret: si.client_secret, customerId: customer });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Stripe Webhook — NOTE: body is parsed as raw in src/index.js
router.post("/webhook", (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (endpointSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = req.body; // unsecured (dev only)
    }
  } catch (err) {
    console.error("Webhook signature verification failed", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle events you care about
  switch (event.type) {
    case "payment_intent.succeeded":
      // const paymentIntent = event.data.object;
      console.log("Payment succeeded");
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

module.exports = router;
