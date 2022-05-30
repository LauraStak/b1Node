import type { EntityManager } from "@mikro-orm/core";
import { Seeder } from "@mikro-orm/seeder";
import { faker } from "@faker-js/faker";
import { Order } from "../entities/order.entity";
import { randomInt } from "crypto";
import { OrderItem } from "../entities/order-item.entity";

export class OrderSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (let index = 0; index < 30; index++) {
      const order = em.create(Order, {
        first_name: faker.name.firstName(),
        last_name: faker.name.lastName(),
        email: faker.internet.email(),
        createdAt: faker.date.past(2),
      });
      for (let j = 0; j < randomInt(1, 5); j++) {
        em.create(OrderItem, {
          order,
          product_title: faker.lorem.words(2),
          price: randomInt(10, 100),
          quantity: randomInt(1, 5),
        });
      }
    }
  }
}
