import express, { Express } from "express";
import "express-async-errors";
import cors from "cors";
import { connectDb, disconnectDB, loadEnv } from "@/config";
import { authRouter, exerciseRouter, objectiveRouter, sheetRouter, workoutRouter } from "@/routers";
import { handleApplicationErrors } from "@/middlewares";

loadEnv();

const app = express();

app
  .use(cors())
  .use(express.json())
  .use("/users", authRouter)
  .use("/objectives", objectiveRouter)
  .use("/exercises", exerciseRouter)
  .use("/sheets", sheetRouter)
  .use("/workouts", workoutRouter)
  .use(handleApplicationErrors);

export async function init(): Promise<Express> {
  await connectDb();
  return Promise.resolve(app);
}

export async function close(): Promise<void> {
  await disconnectDB();
}

export default app;
