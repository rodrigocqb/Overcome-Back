import {
  getObjective,
  postCreateObjective,
  putUpdateObjective,
} from "@/controllers";
import { authenticateToken } from "@/middlewares";
import { Router } from "express";

const objectiveRouter = Router();

objectiveRouter
  .all("/*", authenticateToken)
  .get("/", getObjective)
  .post("/", postCreateObjective)
  .put("/", putUpdateObjective);

export { objectiveRouter };
