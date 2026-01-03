import { AttendanceController } from "../../../controllers/attendanceController";

export async function GET(req: Request) {
    return AttendanceController.getAttendance(req);
}
