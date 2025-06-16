//I am still working on this file. API payment is require to complete this file. OpenAI payment is required to complete this file. Gemini 
//AI not working tried from docs. Will implement this later

import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadPdfToDatabase } from "../controllers/admin.controller.js";
const router = Router();


router.route("/upload-pdf").post(upload.single("pdf"),uploadPdfToDatabase);
export default router;