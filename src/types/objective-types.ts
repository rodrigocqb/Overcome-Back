import { Objective } from "@prisma/client";

export type ObjectiveParams = Omit<Objective, "id" | "createdAt" | "updatedAt">;
export type ObjectiveBodyParams = Omit<ObjectiveParams, "userId">;
