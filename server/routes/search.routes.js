import { Router } from "express";
import { searchCases,getCaseById } from "../controllers/search.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";
import { getAnswerChatBotFaq } from "../controllers/search.controller.js";
const router = Router();
router.get("/",searchCases);
router.get("/case/:id",validateObjectId(),optionalAuth,getCaseById);
router.post("/chatbotfaq",getAnswerChatBotFaq);

export default router;
