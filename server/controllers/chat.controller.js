import { ChatThread } from "../models/chatThread.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Message} from "../models/message.model.js";

export const getUserThreads = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.isAdmin !== undefined ? "client" : "lawyer"; // based on middleware

  const threads = await ChatThread.find({ [role]: userId })
    .populate("client", "fullName email")
    .populate("lawyer", "fullName email")
    .sort({ updatedAt: -1 });

  res.status(200).json(new ApiResponse(200, threads));
});


export const getThreadMessages = asyncHandler(async (req, res) => {
  const threadId = req.params.id;

  const messages = await Message.find({ thread: threadId }).sort({ createdAt: 1 });

  res.status(200).json(new ApiResponse(200, messages));
});



export const sendMessage = asyncHandler(async (req, res) => {
  const threadId = req.params.id;
  const userId = req.user._id;

  const thread = await ChatThread.findById(threadId);
  if (!thread) throw new ApiError(404, "Chat thread not found");

  let senderType;

  if (thread.client.toString() === userId.toString()) {
    senderType = "client";
  } else if (thread.lawyer.toString() === userId.toString()) {
    senderType = "lawyer";
  } else {
    throw new ApiError(403, "You are not a participant of this chat thread");
  }

  const message = await Message.create({
    thread: threadId,
    senderType,
    senderId: userId,
    message: req.body.content,
  });

  res.status(201).json(new ApiResponse(201, message, "Message sent"));
});
