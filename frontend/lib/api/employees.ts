/**
 * API Client for Employees
 */

export interface Employee {
    id: number;
    employeeId: string;
    email: string;
    role: string;
    profile?: {
        firstName: string;
        lastName: string;
        phone?: string;
        address?: string;
        avatarUrl?: string;
        joiningDate: string;
        department?: string;
        designation?: string;
    };
}

export interface EmployeeProfile {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    avatarUrl?: string;
    joiningDate: string;
    department?: string;
    designation?: string;
}

export async function getEmployees(): Promise<Employee[]> {
    const response = await fetch('/api/employees');

    if (!response.ok) {
        throw new Error('Failed to fetch employees');
    }

    return response.json();
}

export async function getProfile(): Promise<EmployeeProfile> {
    const response = await fetch('/api/employees/profile');

    if (!response.ok) {
        throw new Error('Failed to fetch profile');
    }

    return response.json();
}

export async function updateProfile(data: Partial<EmployeeProfile>): Promise<{ message: string; data: EmployeeProfile }> {
    const response = await fetch('/api/employees/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
    }

    return response.json();
}
