const express = require("express");
const router = express.Router();
const { getPoolByTier } = require("./db");

router.get("/data", async (req, res) => {
  const tier = req.header("X-Tenant-Tier");

  try {
    const pool = getPoolByTier(tier);

    const result = await pool.query(
      "SELECT * FROM tenant_data WHERE tier = $1",
      [tier]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

module.exports = router;