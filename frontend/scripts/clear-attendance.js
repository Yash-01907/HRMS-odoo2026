const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

// Load Environment Variables
const envLocal = path.resolve(__dirname, "../.env.local");
const envDefault = path.resolve(__dirname, "../.env");

if (fs.existsSync(envLocal)) {
  dotenv.config({ path: envLocal });
} else {
  dotenv.config({ path: envDefault });
}

if (!process.env.DB_STRING) {
  console.error("DB_STRING not found in env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DB_STRING,
});

async function clearAttendance() {
  const client = await pool.connect();
  try {
    console.log("Clearing all attendance records...");

    // Show current records
    const records = await client.query("SELECT * FROM attendance");
    console.log("Current records:", records.rows);

    // Delete all attendance records
    await client.query("DELETE FROM attendance");

    console.log("All attendance records cleared!");
    console.log("You can now test check-in/check-out fresh.");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

clearAttendance();
