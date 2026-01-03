import { PayrollController } from "../_controllers/payrollController";

export async function GET(req: Request) {
    return PayrollController.getPayroll(req);
}
