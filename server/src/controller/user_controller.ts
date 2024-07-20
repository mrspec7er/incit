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

export const getOauthUri = async (req: Request, res: Response) => {
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

export const oauthCallback = async (req: Request, res: Response) => {
  try {
    const code = req.query.code as string;
    const { provider } = req.query;
    const userData = await service.oauthCallback(code, provider as string);
    res.cookie("userCredentials", {
      email: userData.user.email,
      provider: "Email",
      token: userData.token,
    });

    //res.status(200).json(userData.user);
    res.redirect(process.env.DOMAIN_URL + "/dashboard");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const registerUsers = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const passwordValidationStatus = service.validatePassword(password);

    if (!passwordValidationStatus) {
      res.status(400).json({ message: "Password doesn't match requirement" });
      return;
    }

    const verifyToken = await service.registerUser(email, password);
    res.status(200).json(verifyToken);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const verifyUsers = async (req: Request, res: Response) => {
  try {
    const { token } = req.query;
    const users = await service.verifyUser(token as string);
    res.status(200).json({ message: `verify user with email: ${users.email}` });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const userData = await service.loginUser(email, password);

    res.cookie("userCredentials", {
      email: userData.user.email,
      provider: "Email",
      token: userData.token,
    });

    res.status(200).json(userData);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    await service.logoutUser(email);
    res.clearCookie("userCredentials");

    res.redirect("/");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const statistic = async (req: Request, res: Response) => {
  try {
    const { email } = req.user;
    const statistics = await service.userStatistic(email);

    res.status(200).json(statistics);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
