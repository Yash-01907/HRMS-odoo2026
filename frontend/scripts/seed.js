require('dotenv').config({ path: '.env.local' }); // Make sure you have .env.local in frontend/
const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
 connectionString: process.env.DB_STRING,
});

async function setupDatabase() {
  try {
    await client.connect();
    console.log('🔌 Connected to database...');

    // 1. CLEANUP (Drop existing tables if any)
    await client.query(`
      DROP TABLE IF EXISTS attendance CASCADE;
      DROP TABLE IF EXISTS leaves CASCADE;
      DROP TABLE IF EXISTS salary_structure CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TYPE IF EXISTS user_role;
      DROP TYPE IF EXISTS leave_status;
    `);

    // 2. CREATE TABLES
    // Users Table [cite: 26, 27]
    await client.query(`
      CREATE TYPE user_role AS ENUM ('ADMIN', 'EMPLOYEE');
      
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        employee_id VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role user_role DEFAULT 'EMPLOYEE',
        first_name VARCHAR(100),
        last_name VARCHAR(100),
        phone VARCHAR(20),
        address TEXT,
        profile_pic TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    
    // Salary Structure (Detailed Breakup)
    await client.query(`
      CREATE TABLE salary_structure (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        wage DECIMAL(10, 2) NOT NULL,            -- The fixed Wage defined in requirements
        basic DECIMAL(10, 2) NOT NULL,           -- 50% of Wage
        hra DECIMAL(10, 2) NOT NULL,             -- 50% of Basic
        standard_allowance DECIMAL(10, 2) NOT NULL, -- Fixed (e.g., 4167)
        performance_bonus DECIMAL(10, 2) NOT NULL,  -- 8.33%
        lta DECIMAL(10, 2) NOT NULL,             -- 8.33%
        fixed_allowance DECIMAL(10, 2) NOT NULL, -- Balancing figure
        pf DECIMAL(10, 2) NOT NULL,              -- 12% Deduction
        professional_tax DECIMAL(10, 2) NOT NULL -- Fixed Deduction (e.g., 200)
      );
    `);

    // Attendance Table [cite: 67]
    await client.query(`
      CREATE TABLE attendance (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        check_in TIMESTAMP,
        check_out TIMESTAMP,
        status VARCHAR(20) DEFAULT 'ABSENT',
        UNIQUE(user_id, date)
      );
    `);

    // Leaves Table [cite: 81, 84]
    await client.query(`
      CREATE TYPE leave_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

      CREATE TABLE leaves (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        leave_type VARCHAR(50) NOT NULL,
        start_date DATE NOT NULL,
        end_date DATE NOT NULL,
        reason TEXT,
        status leave_status DEFAULT 'PENDING',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 3. SEED DUMMY DATA
    const saltRounds = 10;
    const adminPass = await bcrypt.hash('admin123', saltRounds);
    const empPass = await bcrypt.hash('emp123', saltRounds);

    // Create Admin and Employee [cite: 13, 14]
    await client.query(`
      INSERT INTO users (employee_id, email, password_hash, role, first_name, last_name, phone)
      VALUES 
      ('ADM001', 'admin@dayflow.com', '${adminPass}', 'ADMIN', 'Aditi', 'Sharma', '9876543210'),
      ('EMP001', 'rahul@dayflow.com', '${empPass}', 'EMPLOYEE', 'Rahul', 'Verma', '9123456789');
    `);

    console.log('✅ Database seeded with Admin (admin@dayflow.com) and Employee (rahul@dayflow.com)');
// --- 4. CALCULATE SALARY COMPONENTS ---
    // Logic based on your requirements image:
    const wage = 50000; // Example Wage
    
    // Components Calculation
    const basic = wage * 0.50;               // Basic = 50% of Wage
    const hra = basic * 0.50;                // HRA = 50% of Basic
    const stdAllowance = 4167;               // Fixed
    const perfBonus = basic * 0.0833;        // 8.33% of Basic
    const lta = basic * 0.0833;              // 8.33% of Basic
    const pf = basic * 0.12;                 // 12% of Basic (Deduction)
    const profTax = 200;                     // Fixed (Deduction)
    const userId = 2;                        // Employee ID


    // Fixed Allowance = Wage - (Sum of all other earning components)
    // Note: We don't subtract PF/Tax here as they are deductions, not earnings.
    const totalEarningsSoFar = basic + hra + stdAllowance + perfBonus + lta;
    const fixedAllowance = wage - totalEarningsSoFar;

    // Insert Calculated Salary
    await client.query(`
      INSERT INTO salary_structure 
      (user_id, wage, basic, hra, standard_allowance, performance_bonus, lta, fixed_allowance, pf, professional_tax)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);
    `, [
      userId, 
      wage, 
      basic, 
      hra, 
      stdAllowance, 
      perfBonus, 
      lta, 
      fixedAllowance, 
      pf, 
      profTax
    ]);

    console.log(`💰 Salary seeded for Employee (Wage: ₹${wage}, Basic: ₹${basic})`);
  } catch (err) {
    console.error('❌ Error:', err);
  } finally {
    await client.end();
  }
}

setupDatabase();