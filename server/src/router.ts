import { Application } from "express";
import userRouter from "./router/user_route";

const routerConfig = (app: Application): void => {
  app.use("/users", userRouter);
};

export default routerConfig;
