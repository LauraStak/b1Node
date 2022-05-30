import { PrimaryKey, Property, Entity } from "@mikro-orm/core";

@Entity()
export class Product {
  @PrimaryKey()
  id: number;

  @Property()
  title: string;

  @Property()
  description: string;

  @Property()
  image: string;

  @Property()
  price: number;
}
