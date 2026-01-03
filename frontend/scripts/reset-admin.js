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

async function resetAdmin() {
    const client = await pool.connect();
    try {
        console.log("Connecting to database...");
        await client.query("BEGIN");

        // 1. Get Company and Role
        const companyRes = await client.query("SELECT id FROM companies LIMIT 1");
        if (companyRes.rows.length === 0) {
            // Seed Company if missing
            await client.query("INSERT INTO companies (name, code) VALUES ('Dayflow', 'OD')");
        }
        const companyId = (await client.query("SELECT id FROM companies LIMIT 1")).rows[0].id;

        const roleRes = await client.query("SELECT id FROM roles WHERE name = 'ADMIN'");
        if (roleRes.rows.length === 0) throw new Error("ADMIN role not found. Run schema migration first.");
        const roleId = roleRes.rows[0].id;

        // 2. Prepare Admin Data
        const email = "admin@dayflow.com";
        const password = "admin123";
        const hashedPassword = await bcrypt.hash(password, 10);
        const employeeId = "ODADMIN001";

        console.log(`Resetting admin user: ${email}`);

        // 3. Upsert User
        const userRes = await client.query(
            `INSERT INTO users (employee_id, email, password_hash, role_id, company_id, is_active, is_first_login)
       VALUES ($1, $2, $3, $4, $5, TRUE, FALSE)
       ON CONFLICT (email) 
       DO UPDATE SET 
         password_hash = EXCLUDED.password_hash,
         role_id = EXCLUDED.role_id,
         is_active = TRUE
       RETURNING id`,
            [employeeId, email, hashedPassword, roleId, companyId]
        );
        const userId = userRes.rows[0].id;

        // 4. Upsert Profile
        await client.query(
            `INSERT INTO employee_profiles (user_id, first_name, last_name, joining_date, designation, department)
       VALUES ($1, 'System', 'Admin', NOW(), 'Administrator', 'IT')
       ON CONFLICT (user_id) DO NOTHING`,
            [userId]
        );

        await client.query("COMMIT");

        console.log("-----------------------------------------");
        console.log("Admin Credentials Updated Successfully!");
        console.log("-----------------------------------------");
        console.log(`Email:       ${email}`);
        console.log(`Employee ID: ${employeeId}`);
        console.log(`Password:    ${password}`);
        console.log("-----------------------------------------");

    } catch (error) {
        await client.query("ROLLBACK");
        console.error("Error resetting admin:", error);
    } finally {
        client.release();
        await pool.end();
    }
}

resetAdmin();
