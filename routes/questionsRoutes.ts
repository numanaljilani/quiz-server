import express from "express";
import signup from "../controllers/auth/signupController";
import { login } from "../controllers/auth/loginController";
import { resetpassword } from "../controllers/auth/resetPasswordController";
import { isAuthenticated } from "../middlewares/auth";
import { addCloudServiceProviders, addCloudServiceProvidersSections, addCloudServiceProvidersSectionsTopics, addExams, addQuestions, getCloudServiceProviders, getCloudServiceProvidersSections, getCloudServiceProvidersSectionsTopics, getLevels, getQuestions } from "../controllers/questions/questionsController";
// import { sendOTP, verifyOTP } from "../controllers/auth/otpController";

const router = express.Router();



// ---------------------------------------- Clouds  ------------------------------------------//
router.post("/clouds", addCloudServiceProviders);
router.get("/clouds", getCloudServiceProviders);


router.post("/clouds-sections", addCloudServiceProvidersSections);
router.get("/clouds-sections/:id", getCloudServiceProvidersSections);


router.post("/clouds-sections-topics", addCloudServiceProvidersSectionsTopics);
router.get("/clouds-sections-topics/:id", getCloudServiceProvidersSectionsTopics);

router.post("/add-questions", addQuestions);
router.post("/add-exams", addExams);

router.get("/questions",getQuestions)
router.get("/levels/:id",getLevels)




export default router;