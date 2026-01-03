
-- 1. Attendance Table
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

-- 2. Leaves Table
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

-- 3. Salary Structure Table
CREATE TABLE IF NOT EXISTS salary_structure (
    user_id INT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    basic_salary DECIMAL(10, 2) NOT NULL DEFAULT 0,
    allowances DECIMAL(10, 2) DEFAULT 0,
    deductions DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Payroll Records Table
CREATE TABLE IF NOT EXISTS payroll_records (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    basic_salary DECIMAL(10, 2) NOT NULL,
    total_allowances DECIMAL(10, 2) NOT NULL,
    total_deductions DECIMAL(10, 2) NOT NULL,
    net_salary DECIMAL(10, 2) NOT NULL,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, month)
);

-- Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_attendance_user_date ON attendance(user_id, date);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_leaves_user ON leaves(user_id);
CREATE INDEX IF NOT EXISTS idx_leaves_status ON leaves(status);
CREATE INDEX IF NOT EXISTS idx_payroll_month ON payroll_records(month);
