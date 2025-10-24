const express = require("express");
const { fn, col, where } = require("sequelize");
const { User, Lead } = require("../../models");
const auth = require("../middleware/auth");

const router = express.Router();

// POST /api/leads/meta  ← super simple receiver
router.post("/", async (req, res) => {
  try {
    const b = req.body;

    // try to match a user by email (case-insensitive)
    const email = (b.email || "").trim().toLowerCase();
    const user = email
      ? await User.findOne({ where: where(fn("lower", col("email")), email) })
      : null;

    const lead = await Lead.create({
      user_id: b.user_id || null,
      created_time: b.created_time ? new Date(b.created_time) : new Date(),
      form_name: b.form_name ?? null,
      service_requested: b.service_requested ?? null,
      description: b.description ?? null,
      email: b.email ?? null,
      full_name: b.full_name ?? null,
      phone: b.phone ?? null,
      post_code: b.post_code ?? null,
      lead_status: b.lead_status ?? null,
      lead_summary: b.lead_summary ?? null,
      source: "meta",
      raw_payload: b, // keep everything for debugging
    });

    return res.status(201).json({ ok: true, id: lead.id });
  } catch (err) {
    console.error("Leads webhook error:", err);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/leads
 * Returns all leads for the authenticated user (newest first).
 */
router.get("/", auth, async (req, res) => {
  try {
    const leads = await Lead.findAll({
      where: { user_id: req.user.id },
      order: [["created_time", "DESC"]],
      attributes: { exclude: ["raw_payload"] }, // keep it lean
    });
    res.json(leads);
  } catch (err) {
    console.error("GET /api/leads error:", err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/leads/:id
 * Returns a single lead ONLY if it belongs to the authenticated user.
 */
router.get("/:id", auth, async (req, res) => {
  try {
    const lead = await Lead.findOne({
      where: { id: req.params.id, user_id: req.user.id },
      attributes: { exclude: ["raw_payload"] },
    });
    if (!lead) return res.status(404).json({ error: "Lead not found" });
    res.json({ data: lead });
  } catch (err) {
    console.error("GET /api/leads/:id error:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
