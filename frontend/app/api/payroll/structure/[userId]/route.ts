import { PayrollController } from "../../../_controllers/payrollController";

export async function GET(req: Request, context: { params: Promise<{ userId: string }> }) {
    return PayrollController.getStructure(req, context);
}

export async function PUT(req: Request, context: { params: Promise<{ userId: string }> }) {
    return PayrollController.updateStructure(req, context);
}
