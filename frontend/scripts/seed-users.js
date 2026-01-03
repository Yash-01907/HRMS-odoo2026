const { Pool } = require("pg");
const bcrypt = require("bcrypt");
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

async function seedUsers() {
  const client = await pool.connect();
  try {
    console.log("Connecting to database...");
    await client.query("BEGIN");

    // 1. Get Company
    let companyId;
    const companyRes = await client.query("SELECT id FROM companies LIMIT 1");
    if (companyRes.rows.length === 0) {
      const newCompany = await client.query(
        "INSERT INTO companies (name, code) VALUES ('Dayflow', 'DF') RETURNING id"
      );
      companyId = newCompany.rows[0].id;
    } else {
      companyId = companyRes.rows[0].id;
    }

    // 2. Get Roles
    const adminRoleRes = await client.query(
      "SELECT id FROM roles WHERE name = 'ADMIN'"
    );
    const employeeRoleRes = await client.query(
      "SELECT id FROM roles WHERE name = 'EMPLOYEE'"
    );

    if (adminRoleRes.rows.length === 0 || employeeRoleRes.rows.length === 0) {
      throw new Error("Roles not found. Make sure migration has run.");
    }

    const adminRoleId = adminRoleRes.rows[0].id;
    const employeeRoleId = employeeRoleRes.rows[0].id;

    // ==========================================
    // SEED ADMIN
    // ==========================================
    const adminEmail = "admin@dayflow.com";
    const adminPass = "admin123";
    const adminHash = await bcrypt.hash(adminPass, 10);
    const adminEmpId = "ODADMI0001";

    console.log(`Seeding Admin: ${adminEmail}`);

    const adminUserRes = await client.query(
      `INSERT INTO users (employee_id, email, password_hash, role_id, company_id, is_active, is_first_login)
             VALUES ($1, $2, $3, $4, $5, TRUE, FALSE)
             ON CONFLICT (email) 
             DO UPDATE SET password_hash = EXCLUDED.password_hash, role_id = EXCLUDED.role_id
             RETURNING id`,
      [adminEmpId, adminEmail, adminHash, adminRoleId, companyId]
    );
    const adminUserId = adminUserRes.rows[0].id;

    await client.query(
      `INSERT INTO employee_profiles (user_id, first_name, last_name, joining_date, designation, department)
             VALUES ($1, 'System', 'Admin', NOW(), 'Administrator', 'IT')
             ON CONFLICT (user_id) DO NOTHING`,
      [adminUserId]
    );

    // ==========================================
    // SEED EMPLOYEE
    // ==========================================
    const empEmail = "employee@dayflow.com";
    const empPass = "employee123";
    const empHash = await bcrypt.hash(empPass, 10);
    const empEmpId = "ODEMP0001";

    console.log(`Seeding Employee: ${empEmail}`);

    const empUserRes = await client.query(
      `INSERT INTO users (employee_id, email, password_hash, role_id, company_id, is_active, is_first_login)
             VALUES ($1, $2, $3, $4, $5, TRUE, FALSE)
             ON CONFLICT (email) 
             DO UPDATE SET password_hash = EXCLUDED.password_hash, role_id = EXCLUDED.role_id
             RETURNING id`,
      [empEmpId, empEmail, empHash, employeeRoleId, companyId]
    );
    const empUserId = empUserRes.rows[0].id;

    await client.query(
      `INSERT INTO employee_profiles (user_id, first_name, last_name, joining_date, designation, department)
             VALUES ($1, 'John', 'Doe', NOW(), 'Software Engineer', 'Engineering')
             ON CONFLICT (user_id) DO NOTHING`,
      [empUserId]
    );

    await client.query("COMMIT");

    console.log("-----------------------------------------");
    console.log("Seed Completed Successfully!");
    console.log("-----------------------------------------");
    console.log("ADMIN CREDENTIALS:");
    console.log(`Email:    ${adminEmail}`);
    console.log(`Password: ${adminPass}`);
    console.log("-----------------------------------------");
    console.log("EMPLOYEE CREDENTIALS:");
    console.log(`Email:    ${empEmail}`);
    console.log(`Password: ${empPass}`);
    console.log("-----------------------------------------");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error seeding users:", error);
  } finally {
    client.release();
    await pool.end();
  }
}

seedUsers();
