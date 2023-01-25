import { getObjective } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const objectiveRouter = Router();

objectiveRouter.all("/*", authenticateToken).get("/", getObjective);

export { objectiveRouter };
