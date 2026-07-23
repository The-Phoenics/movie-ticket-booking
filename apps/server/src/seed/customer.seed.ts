import { faker } from "@faker-js/faker";
import prisma from "@movie-ticket-booking/db";
import type { Customer, User } from "@movie-ticket-booking/shared/types";

// create users and customers
export async function createTestCustomers(count: number = 20) {
  try {
    const users = [];
    for (let i = 1; i <= count; i++) {
      const user: Omit<User, "id" | "createdAt" | "updatedAt"> = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        isOnboarded: true,
        role: "CUSTOMER",
        emailVerified: true,
      };
      users.push(user);
    }

    const dbUsers = await prisma.user.createManyAndReturn({
      data: users,
    });
    const customers: Omit<Customer, "id">[] = [];
    dbUsers.forEach((u) => {
      const customer: Omit<Customer, "id"> = {
        name: u.name ?? "test-username",
        userId: u.id,
      };
      customers.push(customer);
    });
    const dbCustomers = await prisma.customer.createManyAndReturn({
      data: customers,
    });
    return dbCustomers;
  } catch (err) {
    throw new Error(`Failed to seed ${count} customers!`);
  }
}
