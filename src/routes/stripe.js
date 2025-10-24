const express = require("express");
const Stripe = require("stripe");

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create a PaymentIntent (client_secret returned to client)
router.post("/setup-intent", async (req, res) => {
  try {
    const { customerId, email } = req.body;

    // If we’re creating a new customer, include email (and name/metadata if you have it)
    const customer =
      customerId ||
      (
        await stripe.customers.create({
          email: (email || "").trim().toLowerCase(),
        })
      ).id;

    const si = await stripe.setupIntents.create({
      customer,
      usage: "off_session",
      payment_method_types: ["card"],
    });

    res.json({ clientSecret: si.client_secret, customerId: customer });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
