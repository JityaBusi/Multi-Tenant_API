require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const pool = require("./db");

const app = express();
const PORT = process.env.API_PORT || 8080;
app.use(express.json());
app.use("/api", routes);



app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

app.get("/api/data", async (req, res) => {
  const tier = req.header("X-Tenant-Tier");

  if (!tier || !["free", "pro", "enterprise"].includes(tier)) {
    return res.status(400).json({ error: "Invalid or missing X-Tenant-Tier header" });
  }

  try {
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});