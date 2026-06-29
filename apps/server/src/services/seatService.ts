import { ServerApiError } from "@/lib";
import prisma from "@movie-ticket-booking/db";
import type { BatchPayload } from "../../../../packages/db/prisma/generated/internal/prismaNamespace";
import {
  SEAT_STATUS,
  type TheatreMovieSeat,
} from "@movie-ticket-booking/shared/types";
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

export async function deleteSeatsBulk(
  seats: Seat[],
  theatreId: string,
): Promise<BatchPayload> {
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

export async function reserveTheatreMovieSeat(
  customerId: string,
  theatreMovieSeatId: string,
): Promise<boolean> {
  try {
    const result = await prisma.$transaction(async (tx) => {
      const seat = await tx.theatreMovieSeat.findUnique({
        where: {
          id: theatreMovieSeatId,
        },
      });
      if (!seat || seat.status === SEAT_STATUS.SOLD) {
        return false;
      }

      const updatedResult = await tx.theatreMovieSeat.update({
        where: {
          id: theatreMovieSeatId,
        },
        data: {
          status: SEAT_STATUS.SOLD,
        },
      });
      // optimistic approach
      if (!updatedResult) {
        return false;
      }

      // create a new reservation for seat
      await tx.theatreMovieSeatReservation.create({
        data: {
          customerId: customerId,
          theatreMovieSeatId: theatreMovieSeatId,
          duration: SEAT_RESERVATION_DURATION,
          reservedAt: new Date(),
        },
      });
      return true;
    });
    return result;
  } catch (err) {
    throw new ServerApiError("DB Error: Failed to reserve seat for user", 500);
  }
}

export async function verifySeatReservationForUser(
  customerId: string,
  theatreMovieSeatId: string,
) {
  const reservedSeats = await prisma.theatreMovieSeatReservation.findMany({
    where: {
      theatreMovieSeatId: theatreMovieSeatId,
      customerId: customerId,
    },
    orderBy: {
      reservedAt: "desc",
    },
  });
  if (!reservedSeats) return false;
  const firstReservation = reservedSeats[0];
  const reservedTime = new Date(firstReservation!.reservedAt);
  const expirationTimeStamp = new Date(
    reservedTime.getTime() + firstReservation!.duration,
  );
  const currTimeStamp = new Date();
  if (expirationTimeStamp < currTimeStamp) {
    return false;
  }
  return true;
}

export async function updateTheatreMovieSeatExpiredReservation(
  theatreMovieSeats: ({ id: string } & Partial<TheatreMovieSeat>)[],
) {
  try {
    const ids = theatreMovieSeats.map((seat) => seat.id);
    const result = await prisma.theatreMovieSeat.updateMany({
      where: {
        id: {
          in: ids,
        },
      },
      data: {
        status: SEAT_STATUS.AVAILABLE,
      },
    });
    return {
      seatsToUpdate: ids.length,
      seatsUpdated: result.count,
    };
  } catch (err) {
    throw new ServerApiError(
      "DB Error: Failed to update theatre movie expired reservation seats status",
      500,
      err,
    );
  }
}
