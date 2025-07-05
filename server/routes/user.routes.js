import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { summarizePDF,
    sendConnectionRequest,
    getUserHistory,
    deleteUserHistoryById,
    clearUserHistory,
    getUserSavedCases,
    deleteUserSavedCaseById,
    clearUserSavedCases,
    saveCase,
} from "../controllers/user.controller.js";
import { getAllLawyersList } from "../controllers/lawyer.controller.js";
import { getLawyerProfileById} from "../controllers/lawyerProfile.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
import { verifyUserJWT } from "../middlewares/authUser.middleware.js";
const router = Router();

router.route("/summarize").post(verifyUserJWT,upload.single("pdf"),summarizePDF);
router.route("/find-lawyers").get(verifyUserJWT,getAllLawyersList);
router.route("/lawyer-profile/:lawyerId").get(verifyUserJWT,validateObjectId("lawyerId"),getLawyerProfileById);
router.post("/connect/:id",validateObjectId,verifyUserJWT,upload.array("documents", 5),sendConnectionRequest);
router.get("/history",verifyUserJWT,getUserHistory);
router.delete("/history/:caseId",verifyUserJWT,deleteUserHistoryById);
router.delete("/clear-history",verifyUserJWT,clearUserHistory);

router.post("/save-case",verifyUserJWT,saveCase)
router.get("/saved-cases",verifyUserJWT,getUserSavedCases);
router.delete("/saved-cases/:caseId",verifyUserJWT,deleteUserSavedCaseById);
router.delete("/clear-saved-cases",verifyUserJWT,clearUserSavedCases);

//router.get("connections",verifyUserJWT,getAllConnectedLawyers);
//router.get("connection/:id",verifyUserJWT,getConnectionChatPage);
export default router;