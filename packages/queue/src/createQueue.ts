import { Queue, type ConnectionOptions } from "bullmq";
import { QUEUE_TYPE } from "@movie-ticket-booking/shared/types";
import { env } from "@movie-ticket-booking/env/server";

const bullMqConnection: ConnectionOptions = {
  //   host: new URL(env.REDIS_URL).hostname,
  //   port: Number(new URL(env.REDIS_URL).port) || 6379,
  //   password: new URL(env.REDIS_URL).password || undefined,
  url: env.REDIS_URL,
  maxRetriesPerRequest: null,
};

async function createQueue<T>(queueType: QUEUE_TYPE): Promise<Queue> {
  const queue = new Queue<T>(queueType, {
    connection: bullMqConnection,
  });

  await queue.waitUntilReady();
  console.log(`Queue: "${queueType}" connected to redis!`);

  queue.on("error", (err) => {
    console.log("Queue error: ", err);
    throw new Error("Error in redis queue");
  });
  return queue;
}

export default createQueue;
