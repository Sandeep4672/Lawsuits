import { Router } from "express";
import {
    signupLawyer,
    
} from "../controllers/lawyer.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { isVerifiedLawyer } from "../middlewares/isLawyer.middleware.js";
const router = Router();


router.post("/signup", verifyJWT, upload.array("proofFile", 5), signupLawyer);

// router.route("/send-otp").post(sendOtp);


// router.route("/login").get(getLoginPage);
// router.route("/login").post(loginLawyer);

// router.route("/logout").post(verifyJWT, logoutLawyer);

// router.route("/change-password").post(verifyJWT, changeCurrentPassword);


// router.get("/profile/:id", verifyJWT, isVerifiedLawyer, getLawyerProfile);
export default router;
