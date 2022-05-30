import {
  Entity,
  ManyToMany,
  PrimaryKey,
  Property,
  Collection,
} from "@mikro-orm/core";
import { Permission } from "./permission.entity";

@Entity()
export class Role {
  @PrimaryKey()
  id!: number;

  @Property()
  name: string;

  @ManyToMany(() => Permission)
  permissions: Collection<Permission> = new Collection<Permission>(this);
}
