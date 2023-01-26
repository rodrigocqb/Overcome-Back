import { getJournalsByUserId } from "@/controllers";
import { authenticateToken, validateBody } from "@/middlewares";
import { journalSchema } from "@/schemas";
import { Router } from "express";

const journalRouter = Router();

journalRouter
  .all("/*", authenticateToken)
  .get("/", getJournalsByUserId)
  .post("/", validateBody(journalSchema))
  .put("/", validateBody(journalSchema))
  .delete("/:journalId");

export { journalRouter };
