import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

import prisma from "@movie-ticket-booking/db";
import { auth } from "@movie-ticket-booking/auth";
import { createTheatre, addMovieToTheatre } from "./services/businessService";
import { createSeatsBulk } from "./services/seatService";
import { createMovie } from "./services/movieService";

const populate = JSON.parse(fs.readFileSync(path.join(__dirname, "populate.json"), "utf8"));

async function main() {
  console.log("Cleaning database...");
  await prisma.ticket.deleteMany({});
  await prisma.theatreMovieSeatReservation.deleteMany({});
  await prisma.theatreMovieSeat.deleteMany({});
  await prisma.theatreMovie.deleteMany({});
  await prisma.seat.deleteMany({});
  await prisma.movie.deleteMany({});
  await prisma.theatre.deleteMany({});
  await prisma.customer.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.account.deleteMany({});
  await prisma.verification.deleteMany({});
  await prisma.user.deleteMany({});
  console.log("Database cleaned.");

  console.log("Creating users...");
  const businessUsers = populate.users.filter((u: any) => u.role === "BUSINESS");
  const customerUsers = populate.users.filter((u: any) => u.role === "CUSTOMER");

  // Create customer users
  for (const user of customerUsers) {
    console.log(`Signing up customer user: ${user.email}`);
    await auth.api.signUpEmail({
      body: {
        email: user.email,
        password: user.password,
        name: user.name,
        role: user.role,
      },
    });

    const dbUser = await prisma.user.findUniqueOrThrow({
      where: { email: user.email },
    });

    await prisma.customer.create({
      data: {
        userId: dbUser.id,
        name: user.name,
      },
    });
  }

  // Create theatres and seats (mapping to business users)
  const createdTheatres = [];
  for (let i = 0; i < populate.theatres.length; i++) {
    const theatreData = populate.theatres[i];
    let businessUser = businessUsers[i];

    if (!businessUser) {
      // Dynamically generate a business user if there are more theatres than business users
      const sanitizedTitle = theatreData.title.toLowerCase().replace(/[^a-z0-9]/g, "");
      businessUser = {
        name: `${sanitizedTitle}b`,
        email: `${sanitizedTitle}.business@example.com`,
        password: `${sanitizedTitle} business`,
        role: "BUSINESS",
      };
    }

    console.log(`Signing up business user: ${businessUser.email}`);
    await auth.api.signUpEmail({
      body: {
        email: businessUser.email,
        password: businessUser.password,
        name: businessUser.name,
        role: businessUser.role,
      },
    });

    const dbUser = await prisma.user.findUniqueOrThrow({
      where: { email: businessUser.email },
    });

    // Create theatre
    console.log(`Creating theatre: ${theatreData.title}`);
    const createdTheatre = await createTheatre({
      title: theatreData.title,
      address: theatreData.address,
      city: theatreData.city,
      country: theatreData.country,
      userId: dbUser.id,
    });

    // Create seats for this theatre
    console.log(`Creating ${theatreData.seats.length} seats for theatre: ${theatreData.title}`);
    await createSeatsBulk(theatreData.seats, createdTheatre.id);

    createdTheatres.push(createdTheatre);
  }

  // Register any remaining business users who didn't get mapped to a theatre
  for (let i = populate.theatres.length; i < businessUsers.length; i++) {
    const businessUser = businessUsers[i];
    console.log(`Signing up remaining business user: ${businessUser.email}`);
    await auth.api.signUpEmail({
      body: {
        email: businessUser.email,
        password: businessUser.password,
        name: businessUser.name,
        role: businessUser.role,
      },
    });
  }

  // Create movies
  console.log("Creating movies...");
  const createdMovies = [];
  for (const movieData of populate.movies) {
    console.log(`Creating movie: ${movieData.title}`);
    const { movie } = await createMovie({
      title: movieData.title,
      description: movieData.description,
      rating: movieData.rating,
    });
    createdMovies.push(movie);
  }

  // Assign movies to theatres (creating theatreMovie and theatreMovieSeat records)
  console.log("Assigning movies to theatres...");
  for (const theatre of createdTheatres) {
    for (let idx = 0; idx < createdMovies.length + 5; idx++) {
      const movie = createdMovies[idx % createdMovies.length];

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + idx);
      tomorrow.setMinutes(0);
      tomorrow.setSeconds(0);
      tomorrow.setMilliseconds(0);

      const start = new Date(tomorrow);
      start.setHours(10 + idx * 2); // E.g., 10:00, 12:00, 14:00, 16:00

      const end = new Date(tomorrow);
      end.setHours(12 + idx * 2);

      const price = 150 + idx * 50; // Price: 150, 200, 250, 300

      console.log(`Adding show for movie: "${movie.title}" in theatre: "${theatre.title}" from ${start.toISOString()} to ${end.toISOString()}`);
      await addMovieToTheatre(theatre.id, movie.id, start, end, price);
    }
  }

  console.log("Database successfully populated!");
}

main()
  .catch((err) => {
    console.error("Failed to populate database:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });