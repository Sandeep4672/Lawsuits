import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { summarizePDF } from "../controllers/summarize.controller.js";
const router = Router();


router.route("/summarize").post(upload.single("pdf"),summarizePDF);
export default router;