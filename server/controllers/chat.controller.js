import { ChatThread } from "../models/chatThread.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {Message} from "../models/message.model.js";
import { uploadPdfToCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import path from "path";
import fs from "fs";
export const getUserThreads = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.isAdmin !== undefined ? "client" : "lawyer"; 

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


export const sendImageMessage = async (req, res) => {
  const { threadId } = req.params;

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  const thread = await ChatThread.findById(threadId);
  if (!thread) throw new ApiError(404, "Chat thread not found");

  const userId = req.user._id;

  let senderType;
  if (thread.client.toString() === userId.toString()) {
    senderType = "client";
  } else if (thread.lawyer.toString() === userId.toString()) {
    senderType = "lawyer";
  } else {
    throw new ApiError(403, "You are not a participant of this chat thread");
  }

  const tempPath = req.file.path;
  const originalExt = path.extname(req.file.originalname) || getExtFromMime(req.file.mimetype);
  const newPath = tempPath + originalExt;

  try {
    await fs.promises.rename(tempPath, newPath);


    const result = await uploadPdfToCloudinary(newPath);

    const message = await Message.create({
      thread: threadId,
      senderId: userId,
      senderType,
      message: req.body.message || req.file.originalname, 
      attachment: {
        public_id: result.public_id,
        secure_url: result.secure_url,
        original_filename: result.original_filename + originalExt,
      },
    });

    res.status(201).json(new ApiResponse(201, message, "Attachment message sent"));
  } catch (err) {
    console.error("Upload Error:", err);
    throw new ApiError(500, "File upload failed");
  }
};