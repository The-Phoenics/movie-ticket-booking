import {
  Worker,
  type ConnectionOptions,
  type Processor,
  type WorkerOptions,
} from "bullmq";
import { QUEUE_TYPE } from "@movie-ticket-booking/shared/types";
import { env } from "@movie-ticket-booking/env/server";

const bullMqConnection: ConnectionOptions = {
  url: env.REDIS_URL,
  maxRetriesPerRequest: null,
};

const defaultWorkerOptions: WorkerOptions = {
  connection: bullMqConnection,
  concurrency: 5,
  removeOnComplete: { count: 10 },
  removeOnFail: { count: 50 },
};

async function createWorker<T>(
  workerQueueType: QUEUE_TYPE,
  processor: Processor<T>,
  workerOptions: WorkerOptions = defaultWorkerOptions,
) {
  const worker = new Worker(workerQueueType, processor, {
    ...defaultWorkerOptions,
    ...workerOptions,
  });

  worker.on("error", (err) => {
    console.log(
      `Worker: "${QUEUE_TYPE.SEND_TICKET_QUEUE}" worker failed with an error: `,
      err,
    );
  });

  worker.on("completed", (job) => {
    console.log(
      `Worker: ${QUEUE_TYPE.SEND_TICKET_QUEUE} worker finished job with id ${job?.id}`,
    );
  });

  worker.on("failed", (job, err) => {
    console.log(
      `Worker: ${QUEUE_TYPE.SEND_TICKET_QUEUE} worker failed job with id${job?.id}, error: ${err.message}`,
    );
  });

  await worker.waitUntilReady();
  console.log(
    `Worker: "${QUEUE_TYPE.SEND_TICKET_QUEUE}" worker connected to redis`,
  );

  return worker;
}

export default createWorker;
