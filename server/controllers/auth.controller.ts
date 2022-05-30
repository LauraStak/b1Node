import { RequestContext } from "@mikro-orm/core";
import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { RegisterValidation } from "../validation/register.validation";
import bcryptjs from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { wrap } from "@mikro-orm/core";

export const Register = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const { error } = RegisterValidation.validate(body);

    if (error) {
      return res.status(400).send(error.details);
    }

    if (body.password !== body.password_confirm) {
      return res.status(400).send({
        message: "Passwords do not match",
      });
    }

    const em = RequestContext.getEntityManager();

    const user = em.create(User, {
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      password: await bcryptjs.hash(body.password, 10),
    });

    em.persistAndFlush(user);

    const { password, ...data } = user;

    res.send(data);
  } catch (error) {
    console.log(error);
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager();

    const user = await em.findOne(User, { email: req.body.email });

    if (!user) {
      return res.status(404).send({
        message: "Invalid credentials",
      });
    }

    if (!(await bcryptjs.compare(req.body.password, user.password))) {
      return res.status(404).send({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY);

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, //1 day
    });

    res.send({
      message: "success",
    });
  } catch (error) {
    console.log(error);
  }
};

export const AuthenticatedUser = async (req: Request, res: Response) => {
  try {
    const { password, ...user } = req["user"];

    res.send(user);
  } catch (error) {
    console.log(error);
  }
};

export const Logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0 });

  res.send({ message: "success" });
};

export const UpdateInfo = async (req: Request, res: Response) => {
  const user = req["user"];

  const em = RequestContext.getEntityManager();

  const userInfo = await em.findOneOrFail(User, user.id);

  wrap(userInfo).assign({
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    email: req.body.email,
  });

  const { password, ...data } = await em.findOne(User, user.id);

  res.send(data);
};

export const UpdatePassword = async (req: Request, res: Response) => {
  const user = req["user"];

  if (req.body.password !== req.body.password_confirm) {
    return res.status(400).send({
      message: "Passwords do not match",
    });
  }

  const em = RequestContext.getEntityManager();

  const updatedPassword = await em.findOneOrFail(User, user.id);
  const cryptedPass = await bcryptjs.hash(req.body.password, 10);

  wrap(updatedPassword).assign({
    password: cryptedPass,
  });

  const { password, ...data } = user;

  res.send(user);
};
