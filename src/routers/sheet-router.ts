import { postCreateSheet } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { sheetSchema } from "@/schemas";
import { Router } from "express";

const sheetRouter = Router();

sheetRouter
  .all("/*", authenticateToken)
  .post("/", validateBody(sheetSchema), postCreateSheet);

export { sheetRouter };
