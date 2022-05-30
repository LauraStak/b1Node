import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { RequestContext } from "@mikro-orm/core";
import { User } from "../entities/user.entity";
import bcryptjs from "bcryptjs";
import { wrap } from "@mikro-orm/core";

export const Users = async (req: Request, res: Response) => {
  try {
    // const take = 15;
    // const page = parseInt((req.query.page as string) || "1");
    const em = RequestContext.getEntityManager();

    const [data, total] = await em.findAndCount(
      User,
      {},
      { populate: ["role"] }
    );

    res.send({
      data: data.map((u) => {
        const { password, ...data } = u;
        return data;
      }),
      // meta: { total, page, last_page: Math.ceil(total / take) },
    });
  } catch (error) {
    console.log(error);
  }
};

export const CreateUser = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager();

    const { role_id, ...body } = req.body;

    const hashedPassword = await bcryptjs.hash("1234", 10);

    const user = em.create(User, {
      ...body,
      password: hashedPassword,
      role: role_id,
    });

    em.persistAndFlush(user);

    const { password, ...data } = user;

    res.status(201).send(data);
  } catch (error) {
    console.log(error);
  }
};

export const GetUser = async (
  req: Request<{ id: number } & ParamsDictionary>,
  res: Response
) => {
  try {
    const em = RequestContext.getEntityManager();
    const userId = req.params.id;

    const { password, ...user } = await em.findOneOrFail(User, { id: userId });

    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

export const updateUser = async (
  req: Request<{ id: number } & ParamsDictionary>,
  res: Response
) => {
  try {
    const { role_id, ...body } = req.body;
    const em = RequestContext.getEntityManager();

    const user = await em.findOneOrFail(User, req.params.id);

    wrap(user).assign({
      ...body,
      role: role_id,
    });
    const { password, ...data } = await em.findOne(User, req.params.id);

    res.status(202).send(data);
  } catch (error) {
    console.log(error);
  }
};

export const deleteUser = async (
  req: Request<{ id: number } & ParamsDictionary>,
  res: Response
) => {
  try {
    const em = RequestContext.getEntityManager();
    const user = await em.findOneOrFail(User, req.params.id);

    await em.removeAndFlush(user);

    res.status(204).send({ message: "successfully deleted user" });
  } catch (error) {
    console.log(error);
  }
};
