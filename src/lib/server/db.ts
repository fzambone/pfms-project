import { PrismaClient } from "@prisma/client";

// This prevents multiple instances of Prisma Client in development,
// which can cause performance issues with hot-reloading and unexpected behavior.
declare global {
    var prisma: PrismaClient | undefined;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") { 
    global.prisma = prisma; 
}