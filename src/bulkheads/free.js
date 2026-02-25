const { Pool } = require("pg");

const freeDbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,   // small pool
});

module.exports = freeDbPool;