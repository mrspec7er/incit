import * as service from "../service/user_service";
import { Request, Response } from "express";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await service.GetAllUsers();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
