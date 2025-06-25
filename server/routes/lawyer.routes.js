import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { loginLawyer,signupLawyer,logoutLawyer,changeCurrentPassword } from "../controllers/lawyerAuth.controller.js";
const router = Router();
import { verifyLawyerJWT } from "../middlewares/authLawyer.middleware.js";
import { getLawyerById } from "../controllers/lawyer.controller.js";
import { canAccessDashboard } from "../middlewares/dashboardAccess.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
router.post("/signup", upload.array("proofFile", 5), signupLawyer);

// router.route("/send-otp").post(sendOtp);
router.get("/dashboard",verifyLawyerJWT,(req,res)=>{
    res.status(200).
    json({
        success:true
    })
})

// router.route("/login").get(getLoginPage);
router.route("/login").post(loginLawyer);

router.route("/logout").post(verifyLawyerJWT,logoutLawyer);

router.route("/change-password").patch(verifyLawyerJWT, changeCurrentPassword);


router.get("/profile/:id", verifyLawyerJWT,canAccessDashboard,validateObjectId, getLawyerById);
export default router;
