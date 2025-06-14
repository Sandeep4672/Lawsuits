import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();

app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());  

import authRouter from "./routes/auth.routes.js";
import summarizeRouter from "./routes/summarize.routes.js";
app.use("/auth", authRouter);
app.use("/fn",summarizeRouter);  

export { app };
