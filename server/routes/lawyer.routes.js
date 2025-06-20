import { Router } from "express";
import { applyAsLawyer, getLawyerProfile } from "../controllers/lawyer.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isVerifiedLawyer } from "../middlewares/isLawyer.middleware.js";
const router = Router();

router.post("/apply",verifyJWT,    upload.array("proofFile", 5), applyAsLawyer);
router.get("/profile/:id",verifyJWT,isVerifiedLawyer, getLawyerProfile);
export default router;
