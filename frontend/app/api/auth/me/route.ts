import { AuthController } from "../../../../controllers/authController";

export async function GET(req: Request) {
    return AuthController.getMe();
}
