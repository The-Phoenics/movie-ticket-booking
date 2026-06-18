import { env } from "@movie-ticket-booking/env/server";
import Redis from "ioredis";

function createRedisClient() {
  let redis = new Redis(env.REDIS_URL, {
    connectTimeout: 10000,
  });

  redis.on("error", (err) => {
    console.log("Cache: connection error occured:", err);
    throw Error("Failed to connect to redis server");
  });

  redis.on("connect", () => {
    console.log("Cache: Redis client connected successfully");
    // redis.config("SET", "maxmemory-policy", "allkeys-lru");
  });
  return redis;
}

const redisClient = createRedisClient();
export default redisClient;
