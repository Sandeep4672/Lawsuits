
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadPdfToDatabase } from "../controllers/admin.controller.js";
import { verifyJWT,isAdmin } from "../middlewares/auth.middleware.js";
const router = Router();
router.use(verifyJWT, isAdmin);


router.route("/upload-pdf").post(upload.single("pdf"),uploadPdfToDatabase);
export default router;