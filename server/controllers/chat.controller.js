import { ChatThread } from "../models/chatThread.model.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Message } from "../models/message.model.js";
import { uploadFileToCloudinary, deleteFileFromCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/apiError.js";
import path from "path";
import fs from "fs";

// 🧠 Determine role from middleware
function getRoleFromUser(user) {
  return user?.isAdmin !== undefined ? "client" : "lawyer";
}

export const getUserThreads = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = getRoleFromUser(req.user);

  const threads = await ChatThread.find({ [role]: userId })
    .populate("client", "fullName email")
    .populate("lawyer", "fullName email")
    .sort({ updatedAt: -1 });

  res.status(200).json(new ApiResponse(200, threads));
});

export const getThreadMessages = asyncHandler(async (req, res) => {
  const threadId = req.params.id;
  const messages = await Message.find({ thread: threadId }).sort({ createdAt: 1 });
  console.log(messages);
  res.status(200).json(new ApiResponse(200, messages));
});

export const getSingleThread = asyncHandler(async (req, res) => {
  const threadId = req.params.id;
  const userId = req.user._id;

  const thread = await ChatThread.findById(threadId)
    .populate("client", "fullName email _id")
    .populate("lawyer", "fullName email _id");

  if (!thread) throw new ApiError(404, "Chat thread not found");

  const isParticipant =
    thread.client._id.toString() === userId.toString() ||
    thread.lawyer._id.toString() === userId.toString();

  if (!isParticipant) throw new ApiError(403, "Not authorized to access this thread");

  res.status(200).json(new ApiResponse(200, thread));
});

export const sendMessage = asyncHandler(async (req, res) => {
  const threadId = req.params.id;
  const userId = req.user._id;
  const { encryptedMessage, encryptedAESKey, iv } = req.body;

  const thread = await ChatThread.findById(threadId);
  if (!thread) throw new ApiError(404, "Chat thread not found");

  let senderType;
  if (thread.client.toString() === userId.toString()) {
    senderType = "client";
  } else if (thread.lawyer.toString() === userId.toString()) {
    senderType = "lawyer";
  } else {
    throw new ApiError(403, "Not a participant of this thread");
  }

  const message = await Message.create({
    thread: threadId,
    senderType,
    senderId: userId,
    encryptedMessage,
    encryptedAESKey,
    iv,
  });

  res.status(201).json(new ApiResponse(201, message, "Message sent"));
});

export const sendFileMessage = asyncHandler(async (req, res) => {
  const { threadId } = req.params;
  const userId = req.user._id;

  if (!req.file) throw new ApiError(400, "No file uploaded");

  const thread = await ChatThread.findById(threadId);
  if (!thread) throw new ApiError(404, "Chat thread not found");

  let senderType;
  if (thread.client.toString() === userId.toString()) {
    senderType = "client";
  } else if (thread.lawyer.toString() === userId.toString()) {
    senderType = "lawyer";
  } else {
    throw new ApiError(403, "Not a participant of this chat thread");
  }

  const tempPath = req.file.path;
  const originalExt = path.extname(req.file.originalname);
  const newPath = tempPath + originalExt;

  let cloudinaryResult = null;

  try {
    await fs.promises.rename(tempPath, newPath);
    cloudinaryResult = await uploadFileToCloudinary(newPath, "Lawsuits/Messages");

    const message = await Message.create({
      thread: threadId,
      senderType,
      senderId: userId,
      message: req.body.message || req.file.originalname,
      attachment: {
        public_id: cloudinaryResult.public_id,
        secure_url: cloudinaryResult.secure_url,
        original_filename: cloudinaryResult.original_filename + originalExt,
      },
    });

    res.status(201).json(new ApiResponse(201, message, "Attachment message sent"));
  } catch (err) {
    console.error("Upload Error:", err);

    if (cloudinaryResult?.public_id) {
      await deleteFileFromCloudinary(cloudinaryResult.public_id).catch((cleanupErr) => {
        console.error("Cloudinary cleanup failed:", cleanupErr.message);
      });
    }

    throw new ApiError(500, "File upload failed");
  } finally {
    if (fs.existsSync(newPath)) {
      fs.unlinkSync(newPath);
    } else if (fs.existsSync(tempPath)) {
      fs.unlinkSync(tempPath);
    }
  }
});

export const deleteMessage = asyncHandler(async (req, res) => {
  const { threadId, messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);
  if (!message) throw new ApiError(404, "Message not found");

  if (message.thread.toString() !== threadId)
    throw new ApiError(400, "Invalid thread for this message");

  if (message.senderId.toString() !== userId.toString())
    throw new ApiError(403, "You can only delete your own messages");

  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  if (new Date(message.createdAt) < fiveMinutesAgo)
    throw new ApiError(403, "Cannot delete message after 5 minutes");

  if (message.attachment?.public_id) {
    await deleteFileFromCloudinary(message.attachment.public_id).catch((err) => {
      console.error("Cloudinary cleanup failed:", err.message);
    });
  }

  await message.deleteOne();
  res.status(200).json(new ApiResponse(200, null, "Message deleted"));
});
