import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Accept 'email', 'employeeId', or a generic 'identifier' field from the frontend
    const identifier = body.email || body.employeeId ;
    const { password } = body;

    // 1. Validate Input
    if (!identifier || !password) {
      return NextResponse.json(
        { error: 'Email/Employee ID and password are required' },
        { status: 400 }
      );
    }

    // 2. Check if user exists (Search by Email OR Employee ID)
    // We bind the same 'identifier' variable to both checks ($1)
    const result = await query(
      'SELECT * FROM users WHERE email = $1 OR employee_id = $1',
      [identifier]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const user = result.rows[0];

    // 3. Verify Password
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // 4. Return User Data (excluding sensitive password hash)
    const { password_hash, ...userProfile } = user;
    
    return NextResponse.json({
      message: 'Login successful',
      user: userProfile
    });

  } catch (error: any) {
    console.error('Login Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}