import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { Role } from "./role.entity";

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property()
  first_name!: string;

  @Property()
  last_name!: string;

  @Property({ unique: true })
  email!: string;

  @Property()
  password: string;

  @ManyToOne({ entity: () => Role, nullable: true })
  role?: Role;
}
