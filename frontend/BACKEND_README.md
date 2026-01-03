# Dayflow HRMS - Backend Documentation

## Overview
Dayflow HRMS is a production-grade Human Resource Management System built with **Next.js (App Router)**, **TypeScript**, and **PostgreSQL**. The backend follows a strict clean architecture (`Controller` -> `Service` -> `DB`) and uses secure session-based authentication.

## Core Features

### 1. Authentication & Security
- **Unified Login**: Supports login via **Email** or **Employee ID**.
- **Security**: 
  - Passwords hashed using `bcrypt`.
  - Sessions managed via **HTTP-Only, Secure Cookies**.
  - Role-Based Access Control (RBAC) middleware for **ADMIN**, **HR**, and **EMPLOYEE**.
- **Multi-Tenancy Ready**: Database includes `company_id` for future multi-tenant support.

### 2. User & Employee Management
- **Automated ID Generation**: System auto-generates format `OD` + `FN` (First 2 letters of Firstname) + `LN` (Lastname) + `YYYY` + `Sequence` (e.g., `ODJO20260001`).
- **Profile Management**: Employees can view their profile; Admins create employees and manage roles.

### 3. Attendance System
- **Real-time Tracking**: `check-in` and `check-out` endpoints.
- **Validation**: Prevents double check-ins or checking out without check-in.
- **History**: View attendance history by date or user range.

### 4. Leave Management
- **Workflow**:
  1. Employee applies for leave (Paid, Sick, Unpaid).
  2. Leave status defaults to `PENDING`.
  3. Admin/HR approves or rejects the leave.
- **Tracking**: Maintains history of all leaves with admin comments.

### 5. Payroll Management
- **Salary Structure**: Detailed structure including Basic, HRA, Allowances, PF, and Professional Tax.
- **Calculations**: Auto-calculates `Net Salary` based on defined components.
- **Generation**: Batch processing to generate payroll for all active employees for a specific month (e.g., `2026-01`).

### 6. Reports & Analytics
- **Dashboard Summary**: Aggregate stats for Check-ins, Pending Leaves, and Payroll processed.

---

## API Reference

### Authentication
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Login with { identifier, password } | Public |
| `POST` | `/api/auth/logout` | Clear session cookie | Authenticated |
| `GET` | `/api/auth/me` | Get current logged-in user info | Authenticated |

### Employees
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/employees` | Create new employee | Admin/HR |
| `GET` | `/api/employees` | List all employees | Admin/HR |
| `PUT` | `/api/employees/profile` | Update own profile (Avatar/Phone) | Authenticated |

### Attendance
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/attendance/check-in` | Mark attendance for today | Authenticated |
| `POST` | `/api/attendance/check-out` | Mark check-out for today | Authenticated |
| `GET` | `/api/attendance` | Get attendance history | User/Admin |

### Leaves
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leave` | Apply for leave | Authenticated |
| `GET` | `/api/leave` | Get leave history | User/Admin |
| `PUT` | `/api/leave/[id]/approve` | Approve/Reject leave | Admin/HR |

### Payroll
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `PUT` | `/api/payroll/structure/[id]` | Update salary structure | Admin/HR |
| `GET` | `/api/payroll/structure/[id]` | Get salary structure | Admin/HR |
| `POST` | `/api/payroll/generate` | Generate monthly payroll | Admin/HR |
| `GET` | `/api/payroll` | Get payslips | User/Admin |

---

## Database Schema
The system uses **PostgreSQL**. Key tables:
- `users`: Credentials, Roles, Active Status.
- `employee_profiles`: Personal details (Address, Joining Date).
- `attendance`: Daily logs.
- `leaves`: Requests and Approvals.
- `salary_structures`: Base define for calculations.
- `payroll_records`: Final computed monthly salary.

---

## Setup & Scripts

### 1. Environment Setup
Ensure `.env.local` contains:
```env
DB_STRING=postgresql://user:pass@localhost:5432/dayflow_hrms
JWT_SECRET=your_secure_secret
```

### 2. Database Initialization
Run the strict schema setup to create tables:
```bash
npx ts-node frontend/scripts/setup-db.ts
```

### 3. Admin Reset
If you need to reset or create the default admin user:
```bash
node frontend/scripts/reset-admin.js
```
**Default Credentials:**
- **Email:** `admin@dayflow.com`
- **Password:** `admin123`
- **Employee ID:** `ODADMIN001`

### 4. Running the Server
```bash
npm run dev
```
Server starts at `http://localhost:3000`.
