import { getWorkoutsByUserId } from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const workoutRouter = Router();

workoutRouter.all("/*", authenticateToken).get("/", getWorkoutsByUserId);

export { workoutRouter };
