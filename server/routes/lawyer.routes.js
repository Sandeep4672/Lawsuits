import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { loginLawyer, signupLawyer, logoutLawyer, changeCurrentPassword ,verifyOtpAndUpdatePasswordOfLawyer} from "../controllers/lawyerAuth.controller.js";
const router = Router();
import { verifyLawyerJWT } from "../middlewares/authLawyer.middleware.js";
import {  getAllConnectionRequests,acceptConnectionRequest,rejectConnectionRequest,getAllConnections } from "../controllers/lawyer.controller.js";
import { getLawyerProfileById, updateLawyerProfile } from "../controllers/lawyerProfile.controller.js";
router.post("/signup", upload.array("proofFile", 5), signupLawyer);



router.route("/login").post(loginLawyer);

router.route("/logout").post(verifyLawyerJWT, logoutLawyer);

router.route("/change-password").patch(verifyLawyerJWT, changeCurrentPassword);

router.route("/verify-otp/change-password-lawyer").post(verifyOtpAndUpdatePasswordOfLawyer);

router.get("/connections/requests", verifyLawyerJWT, getAllConnectionRequests);

router.patch("/connections/requests/:id/accept",verifyLawyerJWT,acceptConnectionRequest);

router.delete("/connections/requests/:id/reject",verifyLawyerJWT,rejectConnectionRequest);


//router.get("/connections",verifyLawyerJWT,getAllConnections);
router.get("/connections/accepted",verifyLawyerJWT,getAllConnections);
router.get("/my-profile",verifyLawyerJWT,getLawyerProfileById);
router.patch("/update-profile", verifyLawyerJWT, upload.single("profilePicture"), updateLawyerProfile);

export default router;