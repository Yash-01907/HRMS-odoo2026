import { NextResponse } from "next/server";
import { AttendanceService } from "../_services/attendanceService";
import { AuthUtils } from "../_lib/auth-utils";
import { z } from "zod";

export class AttendanceController {
    static async checkIn(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const result = await AttendanceService.checkIn(session.userId as number);
            return NextResponse.json({ message: "Checked in successfully", data: result });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    static async checkOut(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const result = await AttendanceService.checkOut(session.userId as number);
            return NextResponse.json({ message: "Checked out successfully", data: result });
        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    static async getAttendance(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }

            const { searchParams } = new URL(req.url);
            const date = searchParams.get("date"); // YYYY-MM-DD
            const userIdParam = searchParams.get("userId");

            // Admin/HR can view all or specific user
            if (session.role === "ADMIN" || session.role === "HR") {
                if (userIdParam) {
                    const result = await AttendanceService.getMyAttendance(Number(userIdParam));
                    return NextResponse.json(result);
                }
                // If no user specified, get all (filtered by date if provided)
                const result = await AttendanceService.getAllAttendance(date || undefined);
                return NextResponse.json(result);
            }

            // Employees can only view their own
            const result = await AttendanceService.getMyAttendance(session.userId as number);
            return NextResponse.json(result);

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
