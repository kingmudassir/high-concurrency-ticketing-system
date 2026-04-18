import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"

const prismaSingleton = () => {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error("Database URL is missing.")
  }

  console.log("(1) - Making Pool.")
  const pool = new Pool({ connectionString })
  console.log("(2) - Making Adapter.")
  const adapter = new PrismaPg(pool)

  console.log("(3) - Returning Prisma.")
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    console.log("(Root) - Calling prisma because no prior connections.")
    globalForPrisma.prisma = prismaSingleton();
  }

  return globalForPrisma.prisma;
}