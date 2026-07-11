import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config({ path: path.join(__dirname, "../.env") });

import prisma from "@movie-ticket-booking/db";
import { auth } from "@movie-ticket-booking/auth";
import { createTheatre, addMovieToTheatre } from "./services/ownerService";
import { createSeatsBulk } from "./services/seatService";
import { createMovie } from "./services/movieService";
import { ProfileType } from "@movie-ticket-booking/shared/types";

const populate = JSON.parse(fs.readFileSync(path.join(__dirname, "populate.json"), "utf8"));

async function main() {
  console.log("Cleaning database...");
  await prisma.ticket.deleteMany({});
  await prisma.showSeatReservation.deleteMany({});
  await prisma.showSeat.deleteMany({});
  await prisma.show.deleteMany({});
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
  const businessUsers = populate.users.filter((u: any) => u.role === "OWNER");
  const customerUsers = populate.users.filter((u: any) => u.role === "CUSTOMER");

  // Create customer users
  for (const user of customerUsers) {
    console.log(`Signing up customer user: ${user.email}`);
    await auth.api.signUpEmail({
      body: {
        email: user.email,
        password: user.password,
        name: user.name,
        role: ProfileType.CUSTOMER,
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
        role: ProfileType.OWNER,
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
    const createdSeats = await createSeatsBulk(theatreData.seats, createdTheatre.id);
    console.log("======= created seats: -- ", createdSeats.length)

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
        role: ProfileType.OWNER,
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

  // Assign movies to theatres (creating theatreMovie and showSeat records)
  console.log("Assigning movies to theatres...");

  const SHOW_TIMES = [
    { hour: 9, minute: 0 },
    { hour: 11, minute: 45 },
    { hour: 14, minute: 30 },
    { hour: 17, minute: 15 },
    { hour: 20, minute: 0 },
    { hour: 22, minute: 45 },
  ];

  const DAYS_TO_CREATE = 7;

  for (const theatre of createdTheatres) {
    console.log(`Creating shows for ${theatre.title}`);

    for (let day = 0; day < DAYS_TO_CREATE; day++) {
      const showDate = new Date();
      showDate.setDate(showDate.getDate() + day);

      for (let showIndex = 0; showIndex < SHOW_TIMES.length; showIndex++) {
        const movie = createdMovies[(day * SHOW_TIMES.length + showIndex) % createdMovies.length];

        const { hour, minute } = SHOW_TIMES[showIndex] as { hour: number; minute: number };

        const start = new Date(showDate);
        start.setHours(hour, minute, 0, 0);

        const end = new Date(start);
        end.setHours(end.getHours() + 2, end.getMinutes() + 30);

        const price = 150 + (showIndex % 4) * 50;

        console.log(`${theatre.title} | ${movie?.title} | ${start.toLocaleString()}`);

        await addMovieToTheatre(theatre.id, movie?.id || "", start, end, price);
      }
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
