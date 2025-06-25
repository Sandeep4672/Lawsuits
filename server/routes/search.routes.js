import { Router } from "express";
import { searchCases,getCaseById } from "../controllers/search.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
const router = Router();

router.get("/", searchCases);
router.get("/case/:id",validateObjectId,getCaseById);
export default router;
