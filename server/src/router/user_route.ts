import { Router } from "express";
import * as controller from "../controller/user_controller";

const router: Router = Router();

router.get("/", controller.getUsers);

export default router;
