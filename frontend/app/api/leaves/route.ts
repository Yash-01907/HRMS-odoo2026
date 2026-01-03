import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Fetch leaves
// 1. If 'userId' is provided -> Returns that user's leave history (Employee View)
// 2. If no 'userId' is provided -> Returns ALL pending leaves (Admin View)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const statusFilter = searchParams.get('status'); // Optional: filter by PENDING, APPROVED, etc.

  try {
    let text, params;

    if (userId) {
      // Employee View: My Leaves
      text = `SELECT * FROM leaves WHERE user_id = $1 ORDER BY applied_at DESC`;
      params = [userId];
    } else {
      // Admin View: All Leaves (optionally filtered by status)
      if (statusFilter) {
        text = `SELECT leaves.*, users.first_name, users.last_name, users.employee_id 
                FROM leaves 
                JOIN users ON leaves.user_id = users.id 
                WHERE leaves.status = $1 
                ORDER BY leaves.applied_at DESC`;
        params = [statusFilter];
      } else {
        text = `SELECT leaves.*, users.first_name, users.last_name, users.employee_id 
                FROM leaves 
                JOIN users ON leaves.user_id = users.id 
                ORDER BY leaves.applied_at DESC`;
        params = [];
      }
    }

    const result = await query(text, params);
    return NextResponse.json(result.rows);

  } catch (error) {
    console.error('Leaves Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Apply for Leave
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, leaveType, startDate, endDate, reason } = body;

    // 1. Validation
    if (!userId || !leaveType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }

    // 2. Insert Request
    const result = await query(
      `INSERT INTO leaves (user_id, leave_type, start_date, end_date, reason, status)
       VALUES ($1, $2, $3, $4, $5, 'PENDING')
       RETURNING *`,
      [userId, leaveType, startDate, endDate, reason]
    );

    return NextResponse.json({
      message: 'Leave application submitted successfully',
      leave: result.rows[0]
    }, { status: 201 });

  } catch (error) {
    console.error('Leave Application Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}