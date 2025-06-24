import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

import {
  getSignupPage,
  signupUser,
  sendOtp,
  getLoginPage,
  loginUser,
  logoutUser,
  changeCurrentPassword,
} from "../controllers/auth.controller.js";

router.route("/signup").get(getSignupPage);
router.route("/signup").post(signupUser);

router.route("/send-otp").post(sendOtp);


router.route("/login").get(getLoginPage);
router.route("/login").post(loginUser);

router.route("/logout").post(verifyJWT, logoutUser);

router.route("/change-password").post(verifyJWT, changeCurrentPassword);


export default router;
