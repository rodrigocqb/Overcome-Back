import * as jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { createUser, createSession } from "./factories";
import { prisma, redis } from "@/config";

export async function cleanDb() {
  await prisma.workout.deleteMany({});
  await prisma.sheetExercise.deleteMany({});
  await prisma.sheet.deleteMany({});
  await prisma.exercise.deleteMany({});
  await prisma.objective.deleteMany({});
  await prisma.journal.deleteMany({});
  await prisma.session.deleteMany({});
  await prisma.user.deleteMany({});
  await redis.flushAll();
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createSession(token);

  return token;
}
