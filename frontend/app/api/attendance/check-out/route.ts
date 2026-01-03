import { AttendanceController } from "../../_controllers/attendanceController";

export async function POST(req: Request) {
    return AttendanceController.checkOut(req);
}
