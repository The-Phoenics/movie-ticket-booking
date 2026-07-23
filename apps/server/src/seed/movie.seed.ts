import prisma from "@movie-ticket-booking/db";
import { faker } from "@faker-js/faker";
import type { Movie } from "@movie-ticket-booking/shared/types";

export async function createMovie(overrides: Partial<Omit<Movie, "id">> = {}) {
  return prisma.movie.create({
    data: {
      tmdbMovieId: faker.number.int({ min: 100000, max: 999999 }),
      title: faker.lorem.words(3),
      overview: faker.lorem.paragraph(),
      adult: false,
      original_language: "en",
      release_date: new Date(),
      popularity: 100,
      status: "Released",
      tagline: faker.lorem.sentence(),
      img: faker.image.url(),
      vote_average: 8,
      genres: ["Action"] as any, // TODO
      ...overrides,
    },
  });
}
