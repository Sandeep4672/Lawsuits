import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { summarizePDF } from "../controllers/home.controller.js";
import { getAllLawyersList } from "../controllers/lawyer.controller.js";
import { getLawyerById} from "../controllers/lawyer.controller.js";
const router = Router();


router.route("/summarize").post(upload.single("pdf"),summarizePDF);
router.route("/find-lawyers").get(getAllLawyersList);
router.route("/lawyer-profile/:id").get(getLawyerById);
export default router;