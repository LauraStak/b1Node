import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../entities/user.entity";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: Function
) => {
  try {
    const jwtToken = req.cookies["jwt"];

    const payload: any = jwt.verify(jwtToken, process.env.SECRET_KEY);

    if (!payload) {
      return res.status(401).send({
        message: "Unauthenticated",
      });
    }

    const em = RequestContext.getEntityManager();

    req["user"] = await em.findOne(User, payload.id, {
      populate: ["role", "role.permissions"],
    });

    next();
  } catch (error) {
    return res.status(401).send({
      message: "Unauthenticated",
    });
  }
};
