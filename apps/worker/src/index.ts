import { QUEUE_TYPE, type SendTicketJobDataType } from "@movie-ticket-booking/shared/types";
import createWorker from "./createWorker";
import analyticsProcessor from "./sendTicketProcessor";

await createWorker<SendTicketJobDataType>(
  QUEUE_TYPE.SEND_TICKET_QUEUE,
  analyticsProcessor,
);
