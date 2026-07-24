import { env } from "@movie-ticket-booking/env/server";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../prisma/generated/client";

export function createPrismaClient() {
  const adapter = new PrismaPg({
    connectionString: env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

async function checkConnection(prisma: PrismaClient) {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("DB: Database connected successfully!");
    return true;
  } catch (error) {
    console.error("DB: Database connection failed. Make sure db server is running.");
    process.exit(1);
  }
}

export async function clearDatabase() {
  const propertyNames = Object.getOwnPropertyNames(prisma);
  const modelNames = propertyNames.filter((name) => !name.startsWith("_") && !name.startsWith("$"));

  for (const modelName of modelNames) {
    // Map your model name to its actual lower-case/snake-case database table name if needed
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${modelName}" RESTART IDENTITY CASCADE;`);
  }
}

const prisma = createPrismaClient();
checkConnection(prisma);
export default prisma;
