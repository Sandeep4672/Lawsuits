import { Router } from "express";
import {
  uploadRSAPublicKey,
  getPublicKeyForUser
} from "../controllers/rsaKey.controller.js";
import { verifyUserJWT } from "../middlewares/authUser.middleware.js";
import { verifyLawyerJWT } from "../middlewares/authLawyer.middleware.js";

const router = Router();

// Upload route for both users and lawyers
router.post(
  "/upload",
  (req, res, next) => {
    // Either user or lawyer should be able to authenticate
    verifyUserJWT(req, res, (err) => {
      if (err) {
        verifyLawyerJWT(req, res, next); // Try lawyer auth
      } else {
        next(); // User auth succeeded
      }
    });
  },
  uploadRSAPublicKey
);

// Get public key for a given user or lawyer
router.get("/user/:id", getPublicKeyForUser);

export default router;
