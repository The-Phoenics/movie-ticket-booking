import prisma from "@movie-ticket-booking/db";
import { createSeats } from "./seat.seed";
import { createShow } from "./show.seed";

export async function createShowSeats({
  showId,
  theatreId,
  price = 250,
}: {
  showId?: string;
  theatreId?: string;
  price?: number;
} = {}) {
  let show = showId
    ? await prisma.show.findUniqueOrThrow({
        where: { id: showId },
      })
    : await createShow();

  const seats = await createSeats(theatreId ?? show.theatreId);

  await prisma.showSeat.createMany({
    data: seats.map((seat) => ({
      seatId: seat.id,
      showId: show.id,
      price,
    })),
  });

  return prisma.showSeat.findMany({
    where: {
      showId: show.id,
    },
    include: {
      seat: true,
    },
    orderBy: [
      {
        seat: {
          row: "asc",
        },
      },
      {
        seat: {
          col: "asc",
        },
      },
    ],
  });
}
