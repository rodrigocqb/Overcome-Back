import { prisma } from "@/config";
import { SignUpParams } from "@/types/auth-types";

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

const authRepository = { findUserByEmail, createUser };

export default authRepository;
