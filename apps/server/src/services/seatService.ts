import { ServerApiError } from "@/lib";
import prisma from "@movie-ticket-booking/db";
import type { BatchPayload } from "../../../../packages/db/prisma/generated/internal/prismaNamespace";

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
