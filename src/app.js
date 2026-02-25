require("dotenv").config();
const express = require("express");
const rateLimit = require("express-rate-limit");
const routes = require("./routes");
const { getPoolByTier } = require("./db");

const app = express();
const PORT = process.env.API_PORT || 8080;

app.use(express.json());

/* -----------------------
   Tier-Based Rate Limits
------------------------ */

const freeLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Free tier rate limit exceeded",
});

const proLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 50,
  message: "Pro tier rate limit exceeded",
});

const enterpriseLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: "Enterprise tier rate limit exceeded",
});

/* -----------------------
   Dynamic Bulkhead Middleware
------------------------ */

app.use((req, res, next) => {
  const tier = req.header("X-Tenant-Tier");

  if (!tier || !["free", "pro", "enterprise"].includes(tier)) {
    return res.status(400).json({
      error: "Invalid or missing X-Tenant-Tier header",
    });
  }

  // Attach correct limiter
  if (tier === "free") return freeLimiter(req, res, next);
  if (tier === "pro") return proLimiter(req, res, next);
  if (tier === "enterprise") return enterpriseLimiter(req, res, next);
});

/* -----------------------
   Routes
------------------------ */

app.use("/api", routes);

/* -----------------------
   Health Check
------------------------ */

app.get("/health", async (req, res) => {
  try {
    const pool = getPoolByTier("free"); // test one pool
    await pool.query("SELECT 1");
    res.status(200).json({ status: "healthy" });
  } catch (err) {
    res.status(500).json({ status: "unhealthy" });
  }
});

/* -----------------------
   Start Server
------------------------ */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});