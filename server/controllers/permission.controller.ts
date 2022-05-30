import { Request, Response } from "express";
import { RequestContext } from "@mikro-orm/core";
import { Permission } from "../entities/permission.entity";

export const permissions = async (req: Request, res: Response) => {
  const em = RequestContext.getEntityManager();

  const perms = await em.find(Permission, {});

  res.send(perms);
};
