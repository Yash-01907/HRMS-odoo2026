import { LeaveController } from "../../../controllers/leaveController";

export async function POST(req: Request) {
    return LeaveController.apply(req);
}

export async function GET(req: Request) {
    return LeaveController.getLeaves(req);
}
