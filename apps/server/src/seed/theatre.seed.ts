import prisma from "@movie-ticket-booking/db";
import { faker } from "@faker-js/faker";
import type { Theatre } from "@movie-ticket-booking/shared/types";

export async function createTheatre(overrides: Partial<Omit<Theatre, "id">> = {}) {
  let userId = overrides.userId;

  if (!userId) {
    const owner = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        name: faker.person.fullName(),
        role: "OWNER",
        emailVerified: true,
        isOnboarded: true,
      },
    });

    userId = owner.id;
  }

  return prisma.theatre.create({
    data: {
      userId,
      title: faker.company.name(),
      address: faker.location.streetAddress(),
      city: "Delhi",
      country: "India",
      ...overrides,
    },
  });
}
