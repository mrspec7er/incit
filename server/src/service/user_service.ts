import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GetAllUsers() {
  const users = await prisma.user.findMany();

  return users;
}
