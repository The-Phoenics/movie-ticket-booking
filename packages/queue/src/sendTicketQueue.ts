import {
  QUEUE_TYPE,
  type SendTicketJobDataType,
} from "@movie-ticket-booking/shared/types";
import createQueue from "./createQueue";

const sendTicketQueue = await createQueue<SendTicketJobDataType>(
  QUEUE_TYPE.SEND_TICKET_QUEUE,
);

async function sendTicketJob(jobData: SendTicketJobDataType) {
  let job;
  try {
    job = await sendTicketQueue.add("analytics", jobData);
    console.log("Queue:info JOB ADDED");
  } catch (err) {
    console.log("Queue add job error:", err);
  }
  return job;
}

export default sendTicketJob;
