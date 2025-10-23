const express = require("express");
const jwt = require("jsonwebtoken");
const { User } = require("../../models");
const auth = require("../middleware/auth");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const {
      email,
      name,
      currency_id,
      time_zone_id,
      price_per_lead,
      website,
      phone_number,
      phone_number_country_id,
      password,
      recommended_price_per_lead,
      services,
      location_names,
      location_postal_codes,
      max_monthly_customers,
      services_starting_price,
      business_name,
    } = req.body;

    const user = await User.create({
      email,
      name,
      currency_id,
      time_zone_id,
      price_per_lead: String(price_per_lead),
      website: website || null,
      phone_number,
      phone_number_country_id,
      password,
      recommended_price_per_lead:
        recommended_price_per_lead != null
          ? String(recommended_price_per_lead)
          : null,
      services: Array.isArray(services) ? services : [],
      location_names: Array.isArray(location_names) ? location_names : [],
      location_postal_codes: Array.isArray(location_postal_codes)
        ? location_postal_codes
        : [],
      max_monthly_customers: max_monthly_customers ?? null,
      services_starting_price: services_starting_price ?? null,
      business_name: business_name ?? null,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET
      // {
      //   expiresIn: process.env.JWT_EXPIRES_IN || "", // remove expiration for now
      // }
    );

    res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        currency_id: user.currency_id,
        price_per_lead: user.price_per_lead,
        website: user.website,
        phone_number: user.phone_number,
        phone_number_country_id: user.phone_number_country_id,
      },
      auth_token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await user.checkPassword(password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
      }
    );

    res.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        currency_id: user.currency_id,
        price_per_lead: user.price_per_lead,
        website: user.website,
        phone_number: user.phone_number,
        phone_number_country_id: user.phone_number_country_id,
      },
      auth_token: token,
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

// Get current user
router.get("/me", auth, async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ["password"] },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ ...user.dataValues });
});

// GET /api/stripe/me/payment-method
router.get("/payment-method", auth, async (req, res) => {
  try {
    const appUser = await User.findByPk(req.user.id);
    if (!appUser) return res.status(404).json({ error: "User not found" });

    const email = (appUser.email || "").trim().toLowerCase();

    if (!email)
      return res.json({ has_payment_method: false, customerId: null });

    const list = await stripe.customers.list({ email, limit: 10 });

    customer = list.data[0] || null;

    if (!customer) {
      return res.json({ has_payment_method: false, customerId: null });
    }

    // // 3) Check attached payment methods (cards)
    // const pms = await stripe.paymentMethods.list({
    //   customer: customer.id,
    //   type: "card",
    // });

    return res.json({
      has_payment_method: customer.lenght !== 0,
      // customerId: customer.id,
      // payment_method_ids: pms.data.map((pm) => pm.id), // optional
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
