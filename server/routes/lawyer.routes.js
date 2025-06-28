import { Router } from "express";

import { upload } from "../middlewares/multer.middleware.js";

import { loginLawyer, signupLawyer, logoutLawyer, changeCurrentPassword } from "../controllers/lawyerAuth.controller.js";
const router = Router();
import { verifyLawyerJWT } from "../middlewares/authLawyer.middleware.js";
import { getLawyerById, getAllConnectionRequests,acceptConnectionRequest,rejectConnectionRequest,getAllConnections } from "../controllers/lawyer.controller.js";
import { canAccessDashboard } from "../middlewares/dashboardAccess.middleware.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
router.post("/signup", upload.array("proofFile", 5), signupLawyer);

router.get("/dashboard", verifyLawyerJWT, (req, res) => {
    res.status(200).
        json({
            success: true
        })
})

router.route("/login").post(loginLawyer);

router.route("/logout").post(verifyLawyerJWT, logoutLawyer);

router.route("/change-password").patch(verifyLawyerJWT, changeCurrentPassword);


router.get("/dashboard", verifyLawyerJWT, canAccessDashboard, validateObjectId, getLawyerById);

router.get("/connections/requests", verifyLawyerJWT, getAllConnectionRequests);

router.patch("/connections/requests/:id/accept",verifyLawyerJWT,acceptConnectionRequest);

router.delete("/connections/requests/:id/reject",verifyLawyerJWT,rejectConnectionRequest);


//router.get("/connections",verifyLawyerJWT,getAllConnections);
router.get("/connections/accepted",verifyLawyerJWT,getAllConnections);

export default router;