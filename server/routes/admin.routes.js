
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { uploadPdfToDatabase } from "../controllers/admin.controller.js";
import { verifyJWT,isAdmin } from "../middlewares/auth.middleware.js";
import { getPendingLawyers } from "../controllers/lawyer.controller.js";
import { getVerifiedLawyers } from "../controllers/lawyer.controller.js";
import { getLawyerRequestById } from "../controllers/lawyer.controller.js";
import {acceptLawyerRequest,declineLawyerRequest} from "../controllers/lawyer.controller.js";
const router = Router();
router.use(verifyJWT, isAdmin);


router.route("/upload-pdf").post(upload.single("pdf"),uploadPdfToDatabase);
router.route("/lawyer-requests").get(getPendingLawyers);
router.route("/lawyer-request/:id").get(getLawyerRequestById); 
router.route("/lawyers").get(getVerifiedLawyers);

router.route("/lawyer-request/:id/accept").patch(acceptLawyerRequest);

router.route("/lawyer-request/:id/decline").delete(declineLawyerRequest);

export default router;