import { faker } from "@faker-js/faker";
import { auth } from "@movie-ticket-booking/auth";
import prisma from "@movie-ticket-booking/db";
import type { Customer, Session, User } from "@movie-ticket-booking/shared/types";

type TestCustomer = {
  user: User;
  customer: Customer;
  session: Session;
  sessionToken: string;
  headers: Headers;
};

const DEFAULT_PASSWORD = "password";

export async function createUsers(count: number = 20): Promise<TestCustomer[]> {
  const ctx = await auth.$context;
  const test = ctx.test;

  const customers = await Promise.all(
    Array.from({ length: count }).map(async () => {
      const password = DEFAULT_PASSWORD;
      const hashedPassword = await ctx.password.hash(password);

      const userData = {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        role: "CUSTOMER",
        emailVerified: true,
        isOnboarded: true,
      };
      const createdUser = test.createUser(userData);
      const savedUser = await test.saveUser(createdUser);
      const user = { ...savedUser, ...userData };

      const { session, headers, cookies, token } = await test.login({
        userId: savedUser.id,
      });

      // credential Account row — required for email/password sign-in
      await prisma.account.create({
        data: {
          userId: savedUser.id,
          accountId: savedUser.id,
          providerId: "credential",
          password: hashedPassword,
        },
      });

      const customer = await prisma.customer.create({
        data: {
          userId: savedUser.id,
          name: savedUser.name,
        },
      });
      const authTokenValue = cookies[0]?.name + "=" + cookies[0]?.value;
      return { user, headers, customer, session, sessionToken: authTokenValue };
    }),
  );
  return customers;
}
