import { Token } from "simple-oauth2";
import * as service from "../service/user_service";
import { Request, Response } from "express";

declare module "express-session" {
  interface SessionData {
    token?: Token;
  }
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await service.getAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getAuthorizationUri = async (req: Request, res: Response) => {
  try {
    const { provider } = req.query;

    if (
      provider !== "Google" &&
      provider !== "Facebook" &&
      provider !== "Email"
    ) {
      res.status(400).json({ message: "Auth provider required" });
      return;
    }
    const uri = await service.getAuthorizationURI(provider as string);
    res.status(200).json(uri);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const authorizationACallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const { provider } = req.query;
    const userData = await service.authCallback(code, provider as string);

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
