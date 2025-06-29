import { Router } from "express";
import {
  getUserThreads,
  getThreadMessages,
  sendMessage,
  sendImageMessage
} from "../controllers/chat.controller.js";
import { verifyUserJWT } from "../middlewares/authUser.middleware.js";
import { verifyLawyerJWT } from "../middlewares/authLawyer.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/threads", verifyUserJWT, getUserThreads);
router.get("/threads/:id/messages", verifyUserJWT, getThreadMessages);
router.post("/threads/:id/send", verifyUserJWT, sendMessage);
router.post("/threads/:threadId/upload",verifyUserJWT,upload.single("file"),sendImageMessage);


router.get("/lawyer/threads", verifyLawyerJWT, getUserThreads);
router.get("/lawyer/threads/:id/messages", verifyLawyerJWT, getThreadMessages);
router.post("/lawyer/threads/:id/send", verifyLawyerJWT, sendMessage);

export default router;
