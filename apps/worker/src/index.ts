import { QUEUE_TYPE, type SendTicketJobDataType } from "@movie-ticket-booking/shared/types";
import createWorker from "./createWorker";
import sendTicketProcessor from "./sendTicketProcessor";

await createWorker<SendTicketJobDataType>(
  QUEUE_TYPE.SEND_TICKET_QUEUE,
  sendTicketProcessor,
);
