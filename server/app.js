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

import summarizeRouter from "./routes/summarize.routes.js";
import authRouter from "./routes/auth.routes.js";
//import adminRouter from "./routes/admin.routes.js";
app.use("/auth", authRouter);
app.use("/fn",summarizeRouter);
//app.use("/admin", adminRouter);

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

import { errorMiddleware } from "./middlewares/error.middleware.js";
app.use(errorMiddleware);

export { app };
