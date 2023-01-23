import express from "express";
import cors from "cors";

const app = express();
app.use(cors()).use(express.json());

export default app;
