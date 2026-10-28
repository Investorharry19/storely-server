import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const joinWaitlist = async (data: {
  fullName: string;
  email: string;
  phoneNumber?: string;
}) => {
  const existing = await prisma.waitlist.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    const error: any = new Error("You are already on the waitlist!");
    error.statusCode = 400;
    throw error;
  }

  return await prisma.waitlist.create({
    data,
  });
};

const getWaitlist = async () => {
  return await prisma.waitlist.findMany({
    orderBy: { createdAt: "desc" },
  });
};

const waitlistService = {
  joinWaitlist,
  getWaitlist,
};

export default waitlistService;
