import { PayrollController } from "../../_controllers/payrollController";

export async function POST(req: Request) {
    return PayrollController.generate(req);
}
