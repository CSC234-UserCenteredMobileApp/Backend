import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg";
// Export a singleton instance of PrismaClient
// Prisma 7 requires passing the connection URL to the constructor
export const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

