# 🏢 Dayflow HRMS

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)
![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

**A modern, full-stack Human Resource Management System built with Next.js 16, TypeScript, and PostgreSQL**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Reference](#-api-reference) • [Scripts](#-utility-scripts)

</div>

---

## ✨ Features

### 🔐 Authentication & Security

- **Unified Login** - Login with Email OR Employee ID
- **Secure Sessions** - HTTP-Only cookies with JWT tokens
- **Password Hashing** - bcrypt encryption for all passwords
- **Role-Based Access Control (RBAC)** - Admin, HR, and Employee roles
- **Protected Routes** - Automatic redirection based on authentication status

### 👥 Employee Management

- **Auto-generated Employee IDs** - Format: `{CompanyCode}{FirstInitials}{LastInitials}{Year}{Sequence}`
  - Example: `ODJODO20260001`
- **Profile Management** - View and update personal information
- **Admin Dashboard** - Create, view, and manage all employees
- **Search & Filter** - Find employees by name, email, or ID

### ⏰ Attendance System

- **One-Click Check-In/Out** - Real-time attendance tracking
- **Status Indicator** - Visual feedback for current attendance state
- **Attendance History** - View past attendance records
- **Work Hours Calculation** - Automatic duration tracking
- **Admin View** - See all employee attendance records

### 🏖️ Leave Management

- **Leave Types** - Paid Time Off, Sick Leave, Unpaid Leave
- **Application Workflow** - Submit → Pending → Approved/Rejected
- **Admin Approval** - Approve or reject leave requests
- **Leave History** - Track all leave applications and statuses

### 💰 Payroll System

- **Salary Structure** - Basic, HRA, Allowances, Deductions
- **Auto Calculations** - Net salary computed automatically
- **Batch Processing** - Generate payroll for all employees
- **Payslip Access** - Employees can view their payslips

---

## 🛠️ Tech Stack

| Layer                | Technology                                    |
| -------------------- | --------------------------------------------- |
| **Frontend**         | Next.js 16 (App Router), React 19, TypeScript |
| **Styling**          | Tailwind CSS 4, Framer Motion, Radix UI       |
| **Backend**          | Next.js API Routes (Route Handlers)           |
| **Database**         | PostgreSQL with pg driver                     |
| **Authentication**   | JWT (jose), bcrypt, HTTP-Only Cookies         |
| **Validation**       | Zod schema validation                         |
| **State Management** | React Query, React Hooks                      |

---

## 📦 Installation

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 12.x or higher
- **npm** or **yarn**

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-repo/hrms-dayflow.git
cd hrms-dayflow/frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env.local` file in the `frontend` directory:

```env
# Database Connection
DB_STRING=postgresql://username:password@localhost:5432/dayflow_hrms

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### Step 4: Setup Database

Run the database initialization script:

```bash
node .\scripts\init-db.js
```

This creates all necessary tables:

- `companies` - Multi-tenant company support
- `roles` - ADMIN, HR, EMPLOYEE roles
- `users` - Authentication and credentials
- `employee_profiles` - Personal information
- `attendance` - Daily attendance records
- `leaves` - Leave requests and approvals
- `salary_structures` - Salary components
- `payroll_records` - Monthly payroll history

### Step 5: Create Admin User

```bash
node .\scripts\reset-admin.js
```

This creates the default admin account:
| Credential | Value |
|------------|-------|
| Email | `admin@dayflow.com` |
| Employee ID | `ODADMI0001` |
| Password | `admin123` |

### Step 6: (Optional) Seed Sample Data

```bash
node .\scripts\seed-users.js
```

This creates:

- **Admin**: `admin@dayflow.com` / `admin123`
- **Employee**: `employee@dayflow.com` / `employee123`

### Step 7: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚀 Usage

### Logging In

1. Navigate to `http://localhost:3000`
2. Enter your **Email** or **Employee ID**
3. Enter your **Password**
4. Click **Sign In**

**Role-based Redirection:**

- **Admin/HR** → Dashboard with Employee Management
- **Employee** → Attendance Page

### For Administrators

#### Creating New Employees

1. Login as Admin
2. Go to **Dashboard** → **Employees** tab
3. Click **+ NEW** button
4. Fill in employee details:
   - First Name, Last Name
   - Email (must be unique)
   - Phone, Department, Designation
   - Date of Joining
   - Role (Employee/HR/Admin)
   - Company
5. Click **Create Employee**
6. Share the generated **Employee ID** and **Temporary Password** with the employee

#### Managing Leave Requests

1. Go to **Dashboard** → **Time Off** tab
2. View pending leave requests
3. Click **Approve** or **Reject** for each request

#### Viewing Attendance

1. Go to **Attendance** tab
2. View all employee check-in/check-out records
3. Use search to filter by employee name or ID
4. Navigate months using the month selector

### For Employees

#### Check In/Out

1. Click the **Check IN** button in the navigation bar
2. Button changes to **Check OUT** after check-in
3. Click **Check OUT** at end of day

#### Applying for Leave

1. Go to **Time Off** tab
2. Click **+ NEW**
3. Select leave type and dates
4. Submit the request
5. Wait for admin approval

#### Viewing Attendance History

1. Go to **Attendance** page
2. View your check-in/out times and work hours
3. Navigate between months using the selector

---

## 📡 API Reference

### Authentication

| Method | Endpoint           | Description                      | Access        |
| ------ | ------------------ | -------------------------------- | ------------- |
| `POST` | `/api/auth/login`  | Login with email/ID and password | Public        |
| `POST` | `/api/auth/logout` | Clear session and logout         | Authenticated |
| `GET`  | `/api/auth/me`     | Get current user info with role  | Authenticated |

#### Login Request

```json
POST /api/auth/login
{
  "identifier": "admin@dayflow.com",
  "password": "admin123"
}
```

#### Login Response

```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "employee_id": "ODADMI0001",
    "email": "admin@dayflow.com",
    "role": "ADMIN"
  }
}
```

### Employees

| Method | Endpoint                 | Description              | Access        |
| ------ | ------------------------ | ------------------------ | ------------- |
| `POST` | `/api/employees`         | Create new employee      | Admin/HR      |
| `GET`  | `/api/employees`         | Get all employees        | Admin/HR      |
| `PUT`  | `/api/employees/profile` | Update own profile       | Authenticated |
| `GET`  | `/api/users/me`          | Get current user details | Authenticated |

#### Create Employee Request

```json
POST /api/employees
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@company.com",
  "joiningDate": "2026-01-03",
  "role": "EMPLOYEE",
  "companyName": "Dayflow"
}
```

#### Create Employee Response

```json
{
  "message": "Employee created successfully",
  "employeeId": "ODJODO20260001",
  "tempPassword": "abc12345"
}
```

### Attendance

| Method | Endpoint                    | Description            | Access        |
| ------ | --------------------------- | ---------------------- | ------------- |
| `POST` | `/api/attendance/check-in`  | Check in for today     | Authenticated |
| `POST` | `/api/attendance/check-out` | Check out for today    | Authenticated |
| `GET`  | `/api/attendance`           | Get attendance records | Authenticated |

### Leaves

| Method | Endpoint                  | Description          | Access        |
| ------ | ------------------------- | -------------------- | ------------- |
| `POST` | `/api/leave`              | Apply for leave      | Authenticated |
| `GET`  | `/api/leave`              | Get leave requests   | Authenticated |
| `PUT`  | `/api/leave/[id]/approve` | Approve/Reject leave | Admin/HR      |

#### Apply Leave Request

```json
POST /api/leave
{
  "startDate": "2026-01-10",
  "endDate": "2026-01-12",
  "type": "PAID",
  "reason": "Personal leave"
}
```

#### Update Leave Status

```json
PUT /api/leave/5/approve
{
  "status": "APPROVED",
  "comment": "Approved. Enjoy your leave!"
}
```

### Payroll

| Method | Endpoint                      | Description              | Access        |
| ------ | ----------------------------- | ------------------------ | ------------- |
| `GET`  | `/api/payroll/structure/[id]` | Get salary structure     | Admin/HR      |
| `PUT`  | `/api/payroll/structure/[id]` | Update salary structure  | Admin/HR      |
| `POST` | `/api/payroll/generate`       | Generate monthly payroll | Admin/HR      |
| `GET`  | `/api/payroll`                | Get payroll records      | Authenticated |

---

## 🔧 Utility Scripts

Located in `frontend/scripts/`:

| Script                | Command                              | Description                      |
| --------------------- | ------------------------------------ | -------------------------------- |
| `init-db.js`          | `node .\scripts\init-db.js`          | Initialize database schema       |
| `reset-admin.js`      | `node .\scripts\reset-admin.js`      | Reset admin credentials          |
| `seed-users.js`       | `node .\scripts\seed-users.js`       | Create sample admin and employee |
| `clear-attendance.js` | `node .\scripts\clear-attendance.js` | Clear all attendance records     |

---

## 📁 Project Structure

```
frontend/
├── app/                      # Next.js App Router
│   ├── api/                  # API Routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── attendance/      # Attendance endpoints
│   │   ├── employees/       # Employee management
│   │   ├── leave/           # Leave management
│   │   ├── payroll/         # Payroll endpoints
│   │   └── users/           # User endpoints
│   ├── attendance/          # Attendance page
│   ├── dashboard/           # Admin dashboard
│   │   └── components/      # Dashboard components
│   ├── profile/             # User profile page
│   └── page.tsx             # Login page
├── components/               # Shared UI components
│   ├── auth/                # Login form
│   └── ui/                  # Shadcn UI components
├── controllers/              # Request handlers
├── services/                 # Business logic
├── db/                       # Database config
│   ├── connection.ts        # PostgreSQL connection
│   └── schema.sql           # Database schema
├── lib/                      # Utilities
│   ├── api/                 # API client functions
│   ├── auth.ts              # Authentication helpers
│   ├── hash.ts              # Password hashing
│   └── validation.ts        # Zod schemas
├── scripts/                  # Database scripts
└── public/                   # Static assets
```

---

## 🗄️ Database Schema

### Tables Overview

| Table               | Description                         |
| ------------------- | ----------------------------------- |
| `companies`         | Multi-tenant company support        |
| `roles`             | User roles (ADMIN, HR, EMPLOYEE)    |
| `users`             | User credentials and authentication |
| `employee_profiles` | Personal employee information       |
| `attendance`        | Daily attendance records            |
| `leaves`            | Leave requests and approvals        |
| `salary_structures` | Salary components per employee      |
| `payroll_records`   | Monthly payroll history             |

### Key Relationships

- `users` → `roles` (Many-to-One)
- `users` → `companies` (Many-to-One)
- `employee_profiles` → `users` (One-to-One)
- `attendance` → `users` (Many-to-One)
- `leaves` → `users` (Many-to-One)
- `salary_structures` → `users` (One-to-One)
- `payroll_records` → `users` (Many-to-One)

---

## 🔒 Security Features

- **Password Hashing**: All passwords hashed with bcrypt (10 salt rounds)
- **JWT Tokens**: Secure session management with jose library
- **HTTP-Only Cookies**: Prevents XSS attacks on session tokens
- **RBAC Middleware**: Role-based access control on all protected routes
- **Input Validation**: Zod schema validation on all API inputs
- **SQL Injection Prevention**: Parameterized queries with pg driver

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

### Environment Variables for Production

```env
DB_STRING=postgresql://user:pass@production-db:5432/dayflow_hrms
JWT_SECRET=use-a-very-strong-random-secret-here
NODE_ENV=production
```

---

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Failed**

- Ensure PostgreSQL is running
- Check `DB_STRING` in `.env.local`
- Verify database exists and user has permissions

**2. Login Returns 401**

- Run `node .\scripts\reset-admin.js` to reset admin password
- Ensure you're using correct email: `admin@dayflow.com`

**3. Check-In Shows "Already checked in"**

- Run `node .\scripts\clear-attendance.js` to clear records
- Try again with fresh check-in

**4. Date/Time Issues**

- The system uses local timezone for date comparisons
- Ensure your system timezone is set correctly

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and PostgreSQL**

</div>
