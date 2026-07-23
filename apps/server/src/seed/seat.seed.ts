import prisma from "@movie-ticket-booking/db";
import { createTheatre } from "./theatre.seed";

export async function createSeats(theatreId?: string, rows = 5, cols = 10) {
  if (!theatreId) {
    theatreId = (await createTheatre()).id;
  }

  const seats = [];
  for (let r = 0; r < rows; r++) {
    const row = String.fromCharCode(65 + r);

    for (let c = 1; c <= cols; c++) {
      seats.push({
        theatreId,
        row,
        col: c,
      });
    }
  }

  await prisma.seat.createMany({
    data: seats,
  });

  return prisma.seat.findMany({
    where: {
      theatreId,
    },
    orderBy: [
      {
        row: "asc",
      },
      {
        col: "asc",
      },
    ],
  });
}
