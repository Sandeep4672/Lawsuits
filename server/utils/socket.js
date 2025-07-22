export function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("User connected");

    socket.on("joinRoom", (threadId) => socket.join(threadId));
    socket.on("leaveRoom", (threadId) => socket.leave(threadId));
    socket.on("sendMessage", (message) => {
      io.to(message.threadId).emit("receiveMessage", message);
    });
    socket.on("deleteMessage", ({ messageId, threadId }) => {
      io.to(threadId).emit("messageDeleted", { messageId });
    });
    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
}
