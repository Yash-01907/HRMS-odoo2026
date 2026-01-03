const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables
const envPathLocal = path.resolve(__dirname, "../frontend/.env.local");
const envPath = path.resolve(__dirname, "../frontend/.env");

if (fs.existsSync(envPathLocal)) {
  dotenv.config({ path: envPathLocal });
} else {
  dotenv.config({ path: envPath });
}

async function main() {
  if (!process.env.DB_STRING) {
    console.error("Error: DB_STRING is not defined in environment variables.");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DB_STRING,
  });

  try {
    const schemaPath = path.resolve(__dirname, "../frontend/db/schema.sql");
    console.log(`Reading schema from ${schemaPath}...`);
    if (!fs.existsSync(schemaPath)) {
        console.error("Schema file not found at:", schemaPath);
        process.exit(1);
    }
    const schemaSql = fs.readFileSync(schemaPath, "utf-8");

    console.log("Applying strict schema...");
    await pool.query(schemaSql);
    console.log("Strict schema applied successfully!");
  } catch (error) {
    console.error("Error applying schema:", error);
  } finally {
    await pool.end();
  }
}

main();
