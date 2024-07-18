import { Router } from "express";
import * as controller from "../controller/user_controller";

const router: Router = Router();

router.get("/", controller.getUsers);
router.get("/signup", controller.getAuthorizationUri);
router.get("/callback", controller.authorizationACallback);

export default router;
