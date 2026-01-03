import { NextResponse } from "next/server";
import { AttendanceService } from "../services/attendanceService";
import { AuthUtils } from "../lib/auth";

export class AttendanceController {

    static async checkIn(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const res = await AttendanceService.checkIn(session.userId);
            return NextResponse.json({ message: "Checked In", data: res });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    static async checkOut(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const res = await AttendanceService.checkOut(session.userId);
            return NextResponse.json({ message: "Checked Out", data: res });

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    }

    static async getAttendance(req: Request) {
        try {
            const session = await AuthUtils.getSession();
            if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

            const { searchParams } = new URL(req.url);
            const date = searchParams.get("date") || undefined;
            const userIdParam = searchParams.get("userId");

            if (session.role === "ADMIN" || session.role === "HR") {
                if (userIdParam) {
                    return NextResponse.json(await AttendanceService.getAttendance(Number(userIdParam), date));
                }
                return NextResponse.json(await AttendanceService.getAttendance(undefined, date));
            }

            return NextResponse.json(await AttendanceService.getAttendance(session.userId, date));

        } catch (error: any) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }
    }
}
