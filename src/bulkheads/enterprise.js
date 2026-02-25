const { Pool } = require("pg");

const enterpriseDbPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 50,
});

module.exports = enterpriseDbPool;