import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { Role } from "../entities/role.entity";

enum Permissions {
  "view_users",
  "edit_users",
  "view_roles",
  "edit_roles",
  "view_products",
  "edit_products",
  "view-orders",
  "edit_orders",
}

const ADMIN_PERMISSIONS: Permissions[] = [1, 2, 3, 4, 5, 6, 7, 8];
const EDITOR_PERMISSIONS: Permissions[] = [1, 2, 3, 5, 6, 7, 8];
const VIEWER_PERMISSIONS: Permissions[] = [1, 3, 5, 7];

export class RoleSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const admin = em.create(Role, {
      name: "Admin",
      permissions: ADMIN_PERMISSIONS,
    });
    const editor = em.create(Role, {
      name: "Editor",
      permissions: EDITOR_PERMISSIONS,
    });
    const viewer = em.create(Role, {
      name: "Viewer",
      permissions: VIEWER_PERMISSIONS,
    });
  }
}
