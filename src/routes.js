const express = require("express");
const router = express.Router();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

router.get("/data", async (req, res) => {
  const tier = req.get("X-Tenant-Tier");

  if (!tier) {
    return res.status(400).json({ error: "Missing X-Tenant-Tier header" });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM tenant_data WHERE tier = $1",
      [tier.toLowerCase()]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;