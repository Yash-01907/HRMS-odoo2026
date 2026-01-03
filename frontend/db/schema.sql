-- 1. Companies Table
CREATE TABLE IF NOT EXISTS companies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL, -- e.g., 'OD'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed Default Company
INSERT INTO companies (name, code) VALUES ('Odoo Inc', 'OD') ON CONFLICT (code) DO NOTHING;

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

INSERT INTO roles (name) VALUES ('ADMIN'), ('HR'), ('EMPLOYEE') ON CONFLICT (name) DO NOTHING;

-- 3. Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    company_id INT REFERENCES companies(id),
    employee_id VARCHAR(50) UNIQUE NOT NULL, -- Format: COMP + FN + LN + YEAR + SEQ
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INT REFERENCES roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    is_first_login BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Employee Profiles
CREATE TABLE IF NOT EXISTS employee_profiles (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    avatar_url TEXT,
    joining_date DATE NOT NULL,
    department VARCHAR(100),
    designation VARCHAR(100),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Attendance
CREATE TABLE IF NOT EXISTS attendance (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    check_in TIMESTAMP,
    check_out TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('PRESENT', 'ABSENT', 'HALF_DAY', 'LEAVE')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);

-- 6. Leaves
CREATE TABLE IF NOT EXISTS leaves (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type VARCHAR(20) CHECK (leave_type IN ('PAID', 'SICK', 'UNPAID')),
    reason TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    admin_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Salary Structure (Detailed)
CREATE TABLE IF NOT EXISTS salary_structures (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    basic_salary DECIMAL(10, 2) NOT NULL DEFAULT 0,
    hra DECIMAL(10, 2) DEFAULT 0,
    standard_allowance DECIMAL(10, 2) DEFAULT 0,
    performance_bonus DECIMAL(10, 2) DEFAULT 0,
    lta DECIMAL(10, 2) DEFAULT 0, -- Leave Travel Allowance
    pf DECIMAL(10, 2) DEFAULT 0,    -- Provident Fund (Deduction usually)
    prof_tax DECIMAL(10, 2) DEFAULT 0, -- Professional Tax (Deduction)
    other_deductions DECIMAL(10, 2) DEFAULT 0,
    net_salary_check DECIMAL(10, 2) GENERATED ALWAYS AS (basic_salary + hra + standard_allowance + performance_bonus + lta - pf - prof_tax - other_deductions) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Payroll Records
CREATE TABLE IF NOT EXISTS payroll_records (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- YYYY-MM
    basic_salary DECIMAL(10, 2) NOT NULL,
    total_allowances DECIMAL(10, 2) NOT NULL,
    total_deductions DECIMAL(10, 2) NOT NULL,
    net_salary DECIMAL(10, 2) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, month)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_employee_id ON users(employee_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);
