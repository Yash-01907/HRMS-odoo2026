import { UserController } from "../../../../controllers/userController";

export async function GET(req: Request) {
  return UserController.getMe(req);
}
