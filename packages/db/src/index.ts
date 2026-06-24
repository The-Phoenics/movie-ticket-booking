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
    console.log('DB: Database connected successfully!');
    return true;
  } catch (error) {
    console.error('DB: Database connection failed. Make sure db server is running.');
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

const prisma = createPrismaClient();
checkConnection(prisma);
export default prisma;
