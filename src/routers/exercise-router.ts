import { getExercises } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const exerciseRouter = Router();

exerciseRouter.all("/*", authenticateToken).get("/", getExercises);

export { exerciseRouter };
