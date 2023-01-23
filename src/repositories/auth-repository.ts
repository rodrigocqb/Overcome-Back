import { prisma } from "@/config";
import { UserParams } from "@/types/auth-types";

async function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
}

async function createUser(data: UserParams) {
  return prisma.user.create({
    data,
  });
}

const authRepository = { findUserByEmail, createUser };

export default authRepository;
