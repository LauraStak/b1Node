import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
  @PrimaryKey()
  id: number;

  @Property()
  product_title: string;

  @Property()
  price: number;

  @Property()
  quantity: number;

  @ManyToOne(() => Order)
  order: Order;
}
