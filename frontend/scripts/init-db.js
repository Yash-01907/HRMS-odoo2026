const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load env vars
const envPath = path.resolve(__dirname, "../.env.local");
// fallback to .env if .env.local doesn't exist or is ignored
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config({ path: path.resolve(__dirname, "../.env") });
}

// Check for DB String
const connectionString = process.env.DB_STRING || process.env.DATABASE_URL;

if (!connectionString) {
  console.error(
    "Error: DB_STRING or DATABASE_URL not found in environment variables."
  );
  process.exit(1);
}

const pool = new Pool({
  connectionString,
});

async function runMigration() {
  const client = await pool.connect();
  try {
    const schemaPath = path.join(__dirname, "../app/api/_db/schema.sql");
    const schemaSql = fs.readFileSync(schemaPath, "utf8");

    console.log("Running migration...");
    await client.query("BEGIN");
    await client.query(schemaSql);
    await client.query("COMMIT");
    console.log("Migration completed successfully.");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration();
