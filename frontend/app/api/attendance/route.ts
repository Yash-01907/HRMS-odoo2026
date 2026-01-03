import { AttendanceController } from "../_controllers/attendanceController";

export async function GET(req: Request) {
    return AttendanceController.getAttendance(req);
}
