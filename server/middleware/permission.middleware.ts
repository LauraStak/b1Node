import { Request, Response } from "express";
import { User } from "../entities/user.entity";

export const permissionMiddleware = (access: string) => {
  return (req: Request, res: Response, next: Function) => {
    const user: User = req["user"];

    const permissions = user.role.permissions.getItems();

    if (req.method === "GET") {
      if (
        !permissions.some(
          (p) => p.name === `view_${access}` || p.name === `edit_${access}`
        )
      ) {
        return res.status(401).send({ message: "Unauthorized" });
      } else {
        if (!permissions.some((p) => p.name === `edit_${access}`)) {
          return res.status(401).send({ message: "Unauthorized" });
        }
      }
    }
    next();
  };
};
