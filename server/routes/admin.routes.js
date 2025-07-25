
import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { 
    uploadPdfToDatabase,
    acceptLawyerRequest,
    declineLawyerRequest,
    getAllLawyersRequest ,
    getLawyerRequestById,
    getLawyerById,
    getCaseFiles,
    updateCaseFileById,
    getCaseFileById,deleteCase
} from "../controllers/admin.controller.js";
import { verifyUserJWT, isAdmin } from "../middlewares/authUser.middleware.js";
import { getAllLawyersList } from "../controllers/lawyer.controller.js";
import { validateObjectId } from "../middlewares/validateObjectId.middleware.js";
const router = Router();
router.use(verifyUserJWT, isAdmin);


router.route("/upload-pdf").post(upload.single("pdf"), uploadPdfToDatabase);

router.get("/get-casefiles",getCaseFiles);
router.get("/get-case/:caseId",getCaseFileById)

router.patch("/update-casefile/:caseId",upload.single("pdf"),updateCaseFileById);
//dellete caseby id
router.patch("/delete-case/:id",deleteCase);
router.route("/lawyer-requests").get(getAllLawyersRequest);
router.route("/lawyer-request/:id").get(validateObjectId(),getLawyerRequestById);
router.route("/lawyers").get(getAllLawyersList);
router.route("/lawyer/:id").get(validateObjectId(),getLawyerById)

router.route("/lawyer-request/:id/accept").patch(validateObjectId(),acceptLawyerRequest);

router.route("/lawyer-request/:id/decline").patch(validateObjectId(),declineLawyerRequest);



export default router;