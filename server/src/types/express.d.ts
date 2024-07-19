import { Request } from "express";
import { User } from "@prisma/client";

declare module "express" {
  export interface Request {
    user?: User; // Add your custom properties or methods here
  }
}
