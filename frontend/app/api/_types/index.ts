export interface Role {
  id: number;
  name: string; // 'ADMIN' | 'HR' | 'EMPLOYEE'
}

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role_id: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface EmployeeProfile {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  phone?: string;
  department?: string;
  designation?: string;
  joining_date?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface RegisterDTO {
  email: string;
  password: string;
  role: "ADMIN" | "HR" | "EMPLOYEE";
  firstName: string;
  lastName: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
  token: string;
}
