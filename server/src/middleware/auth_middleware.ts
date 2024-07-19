import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as service from "../service/user_service";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  if (!cookies) {
    return res.status(401).json({ message: "No token provided" });
  }
  try {
    const userCredentials = cookies["userCredentials"];

    if (userCredentials["provider"] === "Email") {
      const decoded = jwt.verify(
        userCredentials["token"],
        "token_secret"
      ) as jwt.JwtPayload;
      const user = await service.getUserByEmail(decoded.email);
      req.user = user;
    }

    if (userCredentials["provider"] === "Google") {
      const userData = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        {
          headers: {
            Authorization: `Bearer ${userCredentials["token"]}`,
          },
        }
      ).then((res) => res.json());

      const user = await service.getUserByEmail(userData.email);
      req.user = user;
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
