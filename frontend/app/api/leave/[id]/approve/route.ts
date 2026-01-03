import { LeaveController } from "../../_controllers/leaveController";

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    return LeaveController.updateStatus(req, context);
}
