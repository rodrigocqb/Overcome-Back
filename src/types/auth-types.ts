import { Session, User } from "@prisma/client";

export type SignUpParams = Pick<User, "email" | "name" | "password">;

export type SignInParams = Pick<User, "email" | "password">;

export type SessionParams = Pick<Session, "userId" | "token">;

export type OAuthParams = Pick<User, "email" | "name">;
