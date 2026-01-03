import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// GET: Fetch today's status and recent history for a user
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // 1. Get Today's Status
    const todayResult = await query(
      `SELECT * FROM attendance 
       WHERE user_id = $1 AND date = CURRENT_DATE`,
      [userId]
    );

    // 2. Get Recent History (Last 5 days)
    const historyResult = await query(
      `SELECT * FROM attendance 
       WHERE user_id = $1 
       ORDER BY date DESC 
       LIMIT 5`,
      [userId]
    );

    return NextResponse.json({
      today: todayResult.rows[0] || null, // null means "Not Checked In"
      history: historyResult.rows
    });

  } catch (error) {
    console.error('Attendance Fetch Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST: Handle Check-In AND Check-Out
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // 1. Check if a record exists for TODAY
    const existing = await query(
      `SELECT * FROM attendance WHERE user_id = $1 AND date = CURRENT_DATE`,
      [userId]
    );

    // CASE A: NO RECORD -> PERFORM CHECK-IN
    if (existing.rows.length === 0) {
      const newRecord = await query(
        `INSERT INTO attendance (user_id, date, check_in, status)
         VALUES ($1, CURRENT_DATE, NOW(), 'PRESENT')
         RETURNING *`,
        [userId]
      );
      
      return NextResponse.json({ 
        message: 'Checked In Successfully', 
        data: newRecord.rows[0],
        action: 'check-in'
      });
    }

    // CASE B: RECORD EXISTS -> PERFORM CHECK-OUT or ERROR
    const record = existing.rows[0];

    if (record.check_out) {
      // Already checked out today
      return NextResponse.json(
        { error: 'You have already completed your attendance for today.' }, 
        { status: 400 }
      );
    } else {
      // Has checked in, but not checked out -> Update Check-out time
      const updatedRecord = await query(
        `UPDATE attendance 
         SET check_out = NOW() 
         WHERE id = $1 
         RETURNING *`,
        [record.id]
      );

      return NextResponse.json({ 
        message: 'Checked Out Successfully', 
        data: updatedRecord.rows[0],
        action: 'check-out'
      });
    }

  } catch (error) {
    console.error('Attendance Action Error:', error);
    return NextResponse.json({ error:error || 'Internal Server Error' }, { status: 500 });
  }
}