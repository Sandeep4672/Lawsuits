import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { loginLawyer,signupLawyer,logoutLawyer } from "../controllers/lawyerAuth.controller.js";
const router = Router();
import { verifyLawyerJWT } from "../middlewares/authLawyer.middleware.js";
import { getLawyerById } from "../controllers/lawyer.controller.js";
import { canAcessDashboard } from "../middlewares/dashboardAccess.middleware.js";

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

// router.route("/change-password").post(verifyJWT, changeCurrentPassword);


router.get("/profile/:id", verifyLawyerJWT,canAcessDashboard, getLawyerById);
export default router;
