import { Router } from "express";
import {
  getUserThreads,
  getThreadMessages,
  sendMessage,
  sendFileMessage,
  deleteMessage,
} from "../controllers/chat.controller.js";
import { verifyUserJWT } from "../middlewares/authUser.middleware.js";
import { verifyLawyerJWT } from "../middlewares/authLawyer.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=Router();

router.get("/threads", verifyUserJWT, getUserThreads);
router.get("/threads/:id/messages", verifyUserJWT, getThreadMessages);
router.post("/threads/:id/send", verifyUserJWT, sendMessage);
router.post("/threads/:threadId/upload", verifyUserJWT, upload.single("file"), sendFileMessage);
router.delete("/threads/:threadId/messages/:messageId", verifyUserJWT, deleteMessage);

router.get("/lawyer/threads", verifyLawyerJWT, getUserThreads);
router.get("/lawyer/threads/:id/messages", verifyLawyerJWT, getThreadMessages);
router.post("/lawyer/threads/:id/send", verifyLawyerJWT, sendMessage);
router.post("/lawyer/threads/:threadId/upload", verifyLawyerJWT, upload.single("file"), sendFileMessage); 
router.delete("/lawyer/threads/:threadId/messages/:messageId", verifyLawyerJWT, deleteMessage);

export default router;
