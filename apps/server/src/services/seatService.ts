import { ServerApiError } from "@/lib";
import prisma from "@movie-ticket-booking/db";
import type { BatchPayload } from "../../../../packages/db/prisma/generated/internal/prismaNamespace";
import { SEAT_STATUS } from "@movie-ticket-booking/shared/types";
import { SEAT_RESERVATION_DURATION } from "@movie-ticket-booking/shared/constants";

type Seat = {
  row: string;
  col: number;
};

export async function createSeatsBulk(seats: Seat[], theatreId: string) {
  let createdSeats = null;
  try {
    const seatsToBeCreated = seats.map((seat) => {
      return {
        theatreId: theatreId,
        row: seat.row,
        col: seat.col,
      };
    });
    createdSeats = await prisma.seat.createManyAndReturn({
      data: seatsToBeCreated,
      skipDuplicates: true,
    });
  } catch (err) {
    throw new ServerApiError("DB error: Failed to create bulk seats", 500);
  }
  return createdSeats;
}

export async function deleteSeatsBulk(seats: Seat[], theatreId: string): Promise<BatchPayload> {
  let deletedSeats = null;
  try {
    const rows: string[] = [];
    const cols: number[] = [];
    seats.forEach((seat) => {
      rows.push(seat.row);
      cols.push(seat.col);
    });

    deletedSeats = await prisma.seat.deleteMany({
      where: {
        theatreId: theatreId,
        row: {
          in: rows,
        },
        col: {
          in: cols,
        },
      },
    });
  } catch (err) {
    throw new ServerApiError("DB error: Failed to delete bulk seats", 500);
  }
  return deletedSeats;
}

export async function reserveTheatreMovieSeat(theatreMovieSeatId: string) {
  try {
    const result = await prisma.$transaction(
      async (tx) => {
        const seat = await tx.theatreMovieSeat.findUnique({
          where: {
            id: theatreMovieSeatId,
          },
        });
        if (!seat || seat.status === SEAT_STATUS.SOLD) {
          return false;
        }

        await Promise.all([
          // update theatre movie seat status
          tx.theatreMovieSeat.update({
            where: {
              id: theatreMovieSeatId,
            },
            data: {
              status: SEAT_STATUS.SOLD,
            },
          }),
          // create or udpate reservation
          tx.theatreMovieSeatReservation.upsert({
            where: {
              theatreMovieSeatId: theatreMovieSeatId,
            },
            create: {
              theatreMovieSeatId: theatreMovieSeatId,
              duration: SEAT_RESERVATION_DURATION,
              reservedAt: new Date(),
            },
            update: {
              duration: SEAT_RESERVATION_DURATION,
              reservedAt: new Date(),
            },
          }),
        ]);
        return true;
      },
      {
        isolationLevel: "Serializable",
      },
    );
    return result;
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to reserve seat for user", 500);
  }
}
