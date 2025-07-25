import { Router } from "express";
import { verifyUserJWT } from "../middlewares/authUser.middleware.js";
const router = Router();

import {
  
  signupUser,
  sendOtp,
  loginUser,
  logoutUser,
  changeCurrentPassword,
  verifyOtp
} from "../controllers/auth.controller.js";


router.route("/signup").post(signupUser);

router.route("/send-otp").post(sendOtp);

router.post("/verify-otp", verifyOtp);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyUserJWT, logoutUser);

router.route("/change-password").patch(verifyUserJWT, changeCurrentPassword);


export default router;
