import { Router } from "express";
import { searchCases,getCaseById } from "../controllers/search.controller.js";

const router = Router();

router.get("/", searchCases);
router.get("/case/:id",getCaseById);
export default router;
