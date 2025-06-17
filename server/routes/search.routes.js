import { Router } from "express";
import { searchCases } from "../controllers/search.controller.js";

const router = Router();

router.get("/", searchCases);

export default router;
