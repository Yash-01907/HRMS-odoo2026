/**
 * API Client for Leave/Time Off
 */

export interface LeaveRequest {
    id: number;
    userId: number;
    startDate: string;
    endDate: string;
    leaveType: 'PAID' | 'SICK' | 'UNPAID';
    reason: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    adminComment?: string;
    employeeName?: string;
}

export interface ApplyLeaveData {
    startDate: string;
    endDate: string;
    type: 'PAID' | 'SICK' | 'UNPAID';
    reason: string;
}

export async function getLeaves(): Promise<LeaveRequest[]> {
    const response = await fetch('/api/leave');

    if (!response.ok) {
        throw new Error('Failed to fetch leaves');
    }

    return response.json();
}

export async function applyLeave(data: ApplyLeaveData): Promise<{ message: string; data: LeaveRequest }> {
    const response = await fetch('/api/leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to apply leave');
    }

    return response.json();
}

export async function updateLeaveStatus(
    leaveId: number,
    status: 'APPROVED' | 'REJECTED',
    comment?: string
): Promise<{ message: string; data: LeaveRequest }> {
    const response = await fetch(`/api/leave/${leaveId}/approve`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, comment }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update leave status');
    }

    return response.json();
}
