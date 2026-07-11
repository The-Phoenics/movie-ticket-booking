import { env } from "@movie-ticket-booking/env/server";
import { SENDER_EMAIL } from "@movie-ticket-booking/shared/constants";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendTicketMail(to: string[], ticketBuffer: Buffer) {
  const { data, error } = await resend.emails.send({
    from: SENDER_EMAIL,
    to: ["thephoenics.dev@gmail.com"],
    // to: to, // TODO: Add custom domain for email in resend for prod till send only you receive the ticket emails
    subject: "Ticket Confirmed",
    html: "<b>Your ticket has been confirmed</b>",
    attachments: [
      {
        filename: "mtb_ticket.pdf",
        content: ticketBuffer,
      },
    ],
  });

  if (error) {
    return console.error("Failed to send ticket email:", { error });
  }
  return data;
}
