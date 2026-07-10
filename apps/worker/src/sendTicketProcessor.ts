import prisma from "@movie-ticket-booking/db";
import type { SendTicketJobDataType } from "@movie-ticket-booking/shared/types";
import type { Job } from "bullmq";

async function sendTicketProcessor(job: Job<SendTicketJobDataType>) {
  // TODO:CURRENT Implement 
  
  console.log("Processed payment and sent ticket:", )

  
}

export default sendTicketProcessor;
