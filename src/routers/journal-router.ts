import {
  getJournalsByUserId,
  postCreateJournal,
  putUpdateJournal,
} from "@/controllers";
import { authenticateToken, validateBody, validateParams } from "@/middlewares";
import { journalParamsSchema, journalSchema } from "@/schemas";
import { Router } from "express";

const journalRouter = Router();

journalRouter
  .all("/*", authenticateToken)
  .get("/", getJournalsByUserId)
  .post("/", validateBody(journalSchema), postCreateJournal)
  .put(
    "/:journalId",
    validateParams(journalParamsSchema),
    validateBody(journalSchema),
    putUpdateJournal,
  )
  .delete("/:journalId", validateParams(journalParamsSchema));

export { journalRouter };
