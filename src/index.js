require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./routes");
const { sequelize } = require("./config/database");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

const allowlist = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://app.omaza.ai",
];

// 1) Stripe webhook must read the raw body — define BEFORE json middleware
app.post(
  "/api/stripe/webhook",
  bodyParser.raw({ type: "application/json" }),
  require("./routes/stripe")
);

// 2) Normal JSON for everything else
app.use(
  cors({
    origin(origin, cb) {
      // Allow mobile apps / curl (no Origin header)
      if (!origin) return cb(null, true);
      return cb(null, allowlist.includes(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.options("*", cors()); // handle preflight quickly
app.use(express.json());
app.use("/api", routes);

app.get("/", (_req, res) => res.send("API is running"));

async function start() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // For dev. For prod, prefer migrations.
    app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
  } catch (err) {
    console.error("Unable to start server:", err);
    process.exit(1);
  }
}

start();
