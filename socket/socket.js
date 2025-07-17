import { Server } from "socket.io";

const io = new Server(7000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("joinRoom", (threadId) => {
    console.log("Joined Room");
    socket.join(threadId);
  });

  socket.on("leaveRoom", (threadId) => {
    socket.leave(threadId);
  });

  socket.on("sendMessage", (message) => {
    console.log(message);
    io.to(message.threadId).emit("receiveMessage", message);
  });

  socket.on("deleteMessage", ({ messageId, threadId }) => {
    io.to(threadId).emit("messageDeleted", { messageId });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});
