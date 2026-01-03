import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import bcrypt from 'bcrypt';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {companyName, email, password, firstName, lastName, phone } = body;

    // 1. Basic Validation
    if (!companyName || !email || !password || !firstName || !lastName || !phone) {
      return NextResponse.json(
        { error: 'Missing required fields (Company Name, Email, Password, First Name, Last Name, Phone)' },
        { status: 400 }
      );
    }

    // 2. Check if Email already exists
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        { error: 'User with this Email already exists' },
        { status: 409 }
      );
    }

    // 3. Generate Employee ID Parts
    const companyCode = companyName.toUpperCase().substring(0, 2);
    
    // Get first 2 letters of First and Last name, uppercase
    const fNamePart = firstName.substring(0, 2).toUpperCase();
    const lNamePart = lastName.substring(0, 2).toUpperCase();
    const nameCode = `${fNamePart}${lNamePart}`;
    
    const currentYear = new Date().getFullYear();

    // 4. Generate Serial Number (Transaction ensures uniqueness)
    // We count how many users joined THIS year to determine the next serial number
    // Note: We use a raw transaction here to prevent race conditions
    
    let newEmployeeId = '';
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);

    // Start Transaction
    await query('BEGIN'); 

    try {
      // Get count of users created in current year
      const countResult = await query(
        `SELECT COUNT(*) FROM users WHERE EXTRACT(YEAR FROM created_at) = $1`,
        [currentYear]
      );
      
      const count = parseInt(countResult.rows[0].count, 10);
      const nextSerial = count + 1;
      
      // Pad with zeros (e.g., 1 -> "0001")
      const serialString = nextSerial.toString().padStart(4, '0');

      // Final ID Format: OI + JODO + 2026 + 0001
      newEmployeeId = `${companyCode}${nameCode}${currentYear}${serialString}`;

      // Insert New User
      const newUser = await query(
        `INSERT INTO users 
         (employee_id, email, password_hash, first_name, last_name, phone, role)
         VALUES ($1, $2, $3, $4, $5, $6, 'EMPLOYEE')
         RETURNING id, employee_id, email, role, first_name, last_name`,
        [newEmployeeId, email, hash, firstName, lastName, phone]
      );

      await query('COMMIT'); // Commit Transaction

      return NextResponse.json({
        message: 'User registered successfully',
        user: newUser.rows[0]
      }, { status: 201 });

    } catch (err) {
      await query('ROLLBACK'); // Rollback if any error occurs
      throw err;
    }

  } catch (error: any) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}