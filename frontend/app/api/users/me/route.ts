import { UserController } from "../../_controllers/userController";

export async function GET(req: Request) {
  return UserController.getMe(req);
}
