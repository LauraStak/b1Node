import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Permission } from "../entities/permission.entity";

const perms = [
  "view_users",
  "edit_users",
  "view_roles",
  "edit_roles",
  "view_products",
  "edit_products",
  "view-orders",
  "edit_orders",
];

export class PermissionSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    perms.forEach((perm) => {
      em.create(Permission, { name: perm });
    });
  }
}
