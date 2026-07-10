import { env } from "@movie-ticket-booking/env/server";
import { SENDER_EMAIL } from "@movie-ticket-booking/shared/constants";
import { Resend } from "resend";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendMail(to: string[], subject: string, html: string) {
  const { data, error } = await resend.emails.send({
    from: SENDER_EMAIL,
    to: to,
    subject: subject,
    html: html,
  });

  if (error) {
    return console.error({ error });
  }
  return data;
}

export async function sendTicketMail(to: string[], ticketBuffer: Buffer) {
  const { data, error } = await resend.emails.send({
    from: SENDER_EMAIL,
    to: ["thephoenics.dev@gmail.com"],
    // to: to,
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
