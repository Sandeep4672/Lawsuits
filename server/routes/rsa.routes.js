import { Router } from "express";
import {
  uploadRSAPublicKey,
  getPublicKeyForUser
} from "../controllers/rsaKey.controller.js";

import { verifyUserJWT } from "../middlewares/authUser.middleware.js";
import { verifyLawyerJWT } from "../middlewares/authLawyer.middleware.js";
import { User } from "../models/user.model.js";
import { Lawyer } from "../models/lawyer.model.js";

const router = Router();

// ✅ Public: Get public key of any user/lawyer
router.get("/user-public/:id", getPublicKeyForUser);

// ✅ Authenticated: Upload your public key
router.post("/upload", verifyUserJWT, uploadRSAPublicKey); // You can duplicate for lawyers if needed

// ✅ Authenticated: Get encrypted private key (USER)
router.get("/user/private-key", verifyUserJWT, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select("encryptedPrivateKey salt iv");
    if (!user || !user.encryptedPrivateKey) {
      return res.status(404).json({ message: "RSA key not found" });
    }

    res.status(200).json({
      data: {
        encryptedPrivateKey: user.encryptedPrivateKey,
    salt: user.salt,
    iv: user.iv,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ✅ Authenticated: Get encrypted private key (LAWYER)
router.get("/lawyer/private-key", verifyLawyerJWT, async (req, res, next) => {
  try {
    console.log("Private key fetching");
    const lawyer = await Lawyer.findById(req.user._id).select("encryptedPrivateKey salt iv");
    if (!lawyer || !lawyer.encryptedPrivateKey) {
      return res.status(404).json({ message: "RSA key not found" });
    }
    console.log("Server is shit",lawyer.rsaPrivateKey);
    res.status(200).json({
      data: {
        encryptedPrivateKey: lawyer.encryptedPrivateKey,
    salt: lawyer.salt,
    iv: lawyer.iv,
      },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
