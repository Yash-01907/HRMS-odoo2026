import { AttendanceController } from "../../../../controllers/attendanceController";

export async function POST(req: Request) {
    return AttendanceController.checkOut(req);
}
