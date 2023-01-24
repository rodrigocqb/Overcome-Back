import { User } from "@prisma/client";

export type UserParams = Pick<User, "email" | "name" | "password">;
