import { Request, Response } from "express";
import { RequestContext } from "@mikro-orm/core";
import { Order } from "../entities/order.entity";
import { Parser } from "json2csv";
import { OrderItem } from "../entities/order-item.entity";
import { EntityManager, EntityRepository } from "@mikro-orm/mysql";
import { DI } from "../index";

export const orders = async (req: Request, res: Response) => {
  try {
    // const take = 15;
    // const page = parseInt((req.query.page as string) || "1");
    const em = RequestContext.getEntityManager();

    const [data, total] = await em.findAndCount(
      Order,
      {},
      { populate: ["order_items"] }
    );

    res.send({
      data: data.map((order: Order) => ({
        id: order.id,
        name: order.name,
        email: order.email,
        total: order.total,
        created_at: order.createdAt,
        order_items: order.order_items,
      })),
    });
  } catch (error) {
    console.log(error);
  }
};

export const exportCsv = async (req: Request, res: Response) => {
  const parser = new Parser({
    fields: ["ID", "Name", "Email", "Product Title", "Price", "Quantity"],
  });
  const em = RequestContext.getEntityManager();
  const orders = await em.find(Order, {}, { populate: ["order_items"] });
  const json = [];

  orders.forEach((order: Order) => {
    json.push({
      ID: order.id,
      Name: order.name,
      Email: order.email,
      "Product title": "",
      Price: "",
      Quantity: "",
    });

    order.order_items.getItems().forEach((item: OrderItem) => {
      json.push({
        ID: "",
        Name: "",
        Email: order.email,
        "Product title": item.product_title,
        Price: item.price,
        Quantity: item.quantity,
      });
    });
  });
  const csv = parser.parse(json);
  res.header("Content-Type", "text/csv");
  res.attachment("orders.csv");
  res.send(csv);
};

// export const chart = async (req: Request, res: Response) => {
//   // @ts-expect-error
//   const em = DI.em as EntityManager;

//   const result = await em
//     .qb(Order, "o")
//     .select([
//       "o.created_at as date",
//       "SUM(order_item.price * order_item.quantity) as sum",
//     ])
//     .join("o.id", "order_item.order_id")
//     .groupBy("date")
//     .getResult();

//   res.send(result);
// };
