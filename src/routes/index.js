const express = require("express");
const authRoutes = require("./auth");
const stripeRoutes = require("./stripe");
const leadsRoutes = require("./leads");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/stripe", stripeRoutes);
app.use("/leads", leadsRoutes);

router.get("/health", (_req, res) => res.json({ ok: true }));

module.exports = router;
