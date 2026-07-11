import prisma from "@movie-ticket-booking/db";
import type { SendTicketJobDataType } from "@movie-ticket-booking/shared/types";
import type { Job } from "bullmq";
import { sendTicketMail } from "./lib";
import genTicketPdf, { type TicketData } from "./lib/pdfkit";

async function sendTicketProcessor(job: Job<SendTicketJobDataType>) {
  try {
    const { showSeatId, orderId } = job.data;
    const [dbShowSeat, dbOrder] = await Promise.all([
      prisma.showSeat.findUnique({
        where: {
          id: showSeatId,
        },
        include: {
          seat: true,
          show: {
            include: {
              movie: true,
              theatre: true,
            },
          },
        },
      }),
      prisma.order.findUnique({
        where: {
          id: orderId,
        },
        include: {
          payment: true,
          showSeat: true,
          customer: {
            include: {
              user: true,
            },
          },
        },
      }),
    ]);

    if (!dbShowSeat || !dbOrder || !dbOrder.payment) {
      return;
    }

    const userEmail = dbOrder.customer.user.email;
    const movieTitle = dbShowSeat.show.movie.title;
    const price = dbOrder.payment.amount;
    const currency = dbOrder.payment.currency;
    const seat = {
      row: dbShowSeat.seat.row,
      col: dbShowSeat.seat.col,
    };
    const theatre = {
      title: dbShowSeat.show.theatre.title,
      address: dbShowSeat.show.theatre.address,
      city: dbShowSeat.show.theatre.city,
      country: dbShowSeat.show.theatre.country,
    };

    const ticketData: TicketData = {
      movieTitle: movieTitle,
      price: price,
      seat: seat,
      currency: currency,
      showTime: {
        start: new Date(dbShowSeat.show.startTime),
        end: new Date(dbShowSeat.show.endTime),
      },
      theatre: theatre,
    };

    const ticket = await genTicketPdf(ticketData);
    await sendTicketMail([userEmail], ticket);
  } catch (err) {
    console.log("WORKER: Failed to send ticket email:", err);
  }
}

export default sendTicketProcessor;
