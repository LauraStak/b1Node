import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { faker } from "@faker-js/faker";
import { Product } from "../entities/product.entity";
import { randomInt } from "crypto";

export class ProductSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (let index = 0; index < 30; index++) {
      em.create(Product, {
        title: faker.commerce.product(),
        description: faker.lorem.paragraph(1),
        image: faker.image.avatar(),
        price: randomInt(1, 1000),
      });
    }
  }
}
