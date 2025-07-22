import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import { app } from "./app.js";
import http from "http"; // ✅ Needed for socket.io
import { Server } from "socket.io";
import { initSocket } from "./utils/socket.js"; // ✅ Custom logic here

dotenv.config();

const PORT = process.env.PORT || 8000;

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Create HTTP server for both Express & Socket.IO
const httpServer = http.createServer(app);

// Attach Socket.IO to HTTP server
const io = new Server(httpServer, {
  cors: {
    origin: "https://lawsuits.vercel.app", // ✅ Update with your client URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

initSocket(io); 

let server;

connectDB()
  .then(() => {
    server = httpServer.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error", error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("SIGINT received. Closing MongoDB...");
  await mongoose.disconnect();
  server?.close(() => process.exit(0));
});

process.on("SIGTERM", async () => {
  console.log("SIGTERM received. Closing MongoDB...");
  await mongoose.disconnect();
  server?.close(() => process.exit(0));
});
