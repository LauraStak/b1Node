import { Request, Response } from "express";
import { RequestContext } from "@mikro-orm/core";
import { Role } from "../entities/role.entity";
import { wrap } from "@mikro-orm/core";

export const getRoles = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager();

    const rols = await em.find(Role, {});

    res.send(rols);
  } catch (error) {
    console.log(error);
  }
};

export const createRoles = async (req: Request, res: Response) => {
  try {
    const { name, permissions }: { name: string; permissions: number[] } =
      req.body;

    const em = RequestContext.getEntityManager();

    const createdRole = em.create(Role, {
      name,
      permissions: permissions,
    });

    em.persistAndFlush(createdRole);

    res.send(createdRole);
  } catch (error) {
    console.log(error);
  }
};

export const getRole = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager();

    const data = await em.findOneOrFail(
      Role,
      { id: parseInt(req.params.id) },
      { populate: ["permissions"] }
    );

    res.status(201).send(data);
  } catch (error) {
    console.log(error);
  }
};

export const updateRole = async (req: Request, res: Response) => {
  try {
    const { name, permissions } = req.body;

    const em = RequestContext.getEntityManager();
    const user = await em.findOneOrFail(Role, { id: parseInt(req.params.id) });

    wrap(user).assign({
      name,
      permissions,
    });
    const updatedRole = await em.findOne(Role, { id: parseInt(req.params.id) });
    res.status(202).send(updatedRole);
  } catch (error) {
    console.log(error);
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager();
    const deletedRole = await em.findOne(Role, parseInt(req.params.id));

    await em.removeAndFlush(deletedRole);
    res.send({ message: "Successfully deleted role" });
  } catch (error) {
    console.log(error);
  }
};
