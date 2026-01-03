/**
 * API Client for Attendance
 */

export interface AttendanceRecord {
    id: number;
    userId: number;
    date: string;
    checkIn: string | null;
    checkOut: string | null;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE';
    employeeName?: string;
    employeeId?: string;
}

export async function getAttendance(params?: {
    userId?: number;
    startDate?: string;
    endDate?: string;
}): Promise<AttendanceRecord[]> {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.set('userId', params.userId.toString());
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);

    const url = `/api/attendance${searchParams.toString() ? `?${searchParams}` : ''}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error('Failed to fetch attendance');
    }

    return response.json();
}

export async function checkIn(): Promise<{ message: string; attendance: AttendanceRecord }> {
    const response = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Check-in failed');
    }

    return response.json();
}

export async function checkOut(): Promise<{ message: string; attendance: AttendanceRecord }> {
    const response = await fetch('/api/attendance/check-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Check-out failed');
    }

    return response.json();
}
