import { User } from "@prisma/client";

export type SignUpParams = Pick<User, "email" | "name" | "password">;
