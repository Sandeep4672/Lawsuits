import { Router } from "express";
import { uploadRSAPublicKey, getPublicKeyForUser } from "../controllers/rsaKey.controller.js";
import { verifyUserJWT } from "../middlewares/authUser.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";

const router = Router();

router.post("/upload", verifyUserJWT, uploadRSAPublicKey);
router.get("/user/:id",validateObjectId, getPublicKeyForUser);

export default router;
