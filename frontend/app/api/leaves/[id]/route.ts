import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

// PATCH: Admin updates status (Approve/Reject)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const leaveId = params.id;
    const body = await request.json();
    const { status } = body; // Expecting 'APPROVED' or 'REJECTED'

    // 1. Validate Status
    const validStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Use APPROVED or REJECTED.' }, 
        { status: 400 }
      );
    }

    // 2. Update Database
    const result = await query(
      `UPDATE leaves 
       SET status = $1 
       WHERE id = $2 
       RETURNING *`,
      [status, leaveId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Leave request not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: `Leave request marked as ${status}`,
      leave: result.rows[0]
    });

  } catch (error) {
    console.error('Leave Update Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}