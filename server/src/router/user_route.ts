import { Router } from "express";
import * as controller from "../controller/user_controller";
import { authMiddleware } from "../middleware/auth_middleware";

const router: Router = Router();

router.get("/", controller.getUsers);
router.get("/signup", controller.getOauthUri);
router.get("/callback", controller.oauthCallback);
router.post("/register", controller.registerUsers);
router.post("/verify", controller.verifyUsers);
router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/statistics", authMiddleware, controller.statistic);

export default router;
