import {
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Collection,
} from "@mikro-orm/core";
import { OrderItem } from "./order-item.entity";

@Entity()
export class Order {
  @PrimaryKey()
  id: number;

  @Property()
  first_name: string;

  @Property()
  last_name: string;

  @Property()
  email: string;

  @Property()
  createdAt: Date = new Date();

  @OneToMany({ entity: () => OrderItem, mappedBy: "order" })
  order_items = new Collection<OrderItem>(this);

  get name(): string {
    return `${this.first_name} ${this.last_name}`;
  }

  get total(): number {
    return this.order_items
      .getItems()
      .reduce((sum, item) => sum + item.quantity * item.price, 0);
  }
}
