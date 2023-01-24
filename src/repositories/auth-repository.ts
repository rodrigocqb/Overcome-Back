import { prisma } from "@/config";
import { SessionParams, SignUpParams } from "@/types";

async function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
}

async function createUser(data: SignUpParams) {
  return prisma.user.create({
    data,
  });
}

async function createSession(data: SessionParams) {
  return prisma.session.create({
    data,
  });
}

export const authRepository = { findUserByEmail, createUser, createSession };
