import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Permission {
  @PrimaryKey()
  id: number;

  @Property()
  name?: string;
}
