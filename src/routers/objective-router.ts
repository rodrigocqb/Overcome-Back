import {
  getObjective,
  postCreateObjective,
  putUpdateObjective,
} from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { objectiveSchema } from "@/schemas";
import { Router } from "express";

const objectiveRouter = Router();

objectiveRouter
  .all("/*", authenticateToken)
  .get("/", getObjective)
  .post("/", validateBody(objectiveSchema), postCreateObjective)
  .put("/", validateBody(objectiveSchema), putUpdateObjective);

export { objectiveRouter };
