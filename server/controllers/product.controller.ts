import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { RequestContext } from "@mikro-orm/core";
import { wrap } from "@mikro-orm/core";
import { Product } from "../entities/product.entity";

export const products = async (req: Request, res: Response) => {
  try {
    // const take = 15;
    // const page = parseInt((req.query.page as string) || "1");
    const em = RequestContext.getEntityManager();

    const [data, total] = await em.findAndCount(Product, {});

    res.send({
      data,
    });
  } catch (error) {
    console.log(error);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const em = RequestContext.getEntityManager();

    const product = em.create(Product, req.body);

    em.persistAndFlush(product);

    res.status(201).send(product);
  } catch (error) {
    console.log(error);
  }
};

export const getProduct = async (
  req: Request<{ id: number } & ParamsDictionary>,
  res: Response
) => {
  try {
    const em = RequestContext.getEntityManager();
    const userId = req.params.id;

    const product = await em.findOneOrFail(Product, { id: userId });

    res.send(product);
  } catch (error) {
    console.log(error);
  }
};

export const updateProduct = async (
  req: Request<{ id: number } & ParamsDictionary>,
  res: Response
) => {
  try {
    const em = RequestContext.getEntityManager();

    const findProduct = await em.findOneOrFail(Product, req.params.id);

    wrap(findProduct).assign(req.body);
    const updatedProduct = await em.findOne(Product, req.params.id);

    res.status(202).send(updatedProduct);
  } catch (error) {
    console.log(error);
  }
};

export const deleteProduct = async (
  req: Request<{ id: number } & ParamsDictionary>,
  res: Response
) => {
  try {
    const em = RequestContext.getEntityManager();
    const product = await em.findOne(Product, req.params.id);

    await em.removeAndFlush(product);

    res.status(204).send({ message: "successfully deleted product" });
  } catch (error) {
    console.log(error);
  }
};
