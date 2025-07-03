import { Router } from "express";
import { searchCases,getCaseById } from "../controllers/search.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
import { optionalAuth } from "../middlewares/optionalAuth.middleware.js";
const router = Router();

router.get("/", searchCases);
router.get("/case/:id",validateObjectId,optionalAuth,getCaseById);
export default router;
