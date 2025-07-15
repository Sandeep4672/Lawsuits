import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import morgan from "morgan";
import compression from "compression";

dotenv.config();

const app = express();

// Security middlewares
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());

// Dev logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Compression
app.use(compression());

// Body parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// CORS
app.use(cors({
  origin: "*",
  credentials: true
}));

// Routes
import homeRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import adminRouter from "./routes/admin.routes.js";
import searchRouter from "./routes/search.routes.js";
import lawyerRouter from "./routes/lawyer.routes.js";
import chatRouter from "./routes/chat.routes.js";
import rsaRouter from "./routes/rsa.routes.js";

app.use("/admin", adminRouter);
app.use("/auth", authRouter);
app.use("/user", homeRouter);
app.use("/search", searchRouter);
app.use("/lawyer", lawyerRouter);
app.use("",chatRouter);
app.use("/encrypt",rsaRouter);

// 404 route
app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Error handler
import { errorMiddleware } from "./middlewares/error.middleware.js";
app.use(errorMiddleware);

export { app };
