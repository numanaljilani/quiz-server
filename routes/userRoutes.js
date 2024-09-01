import express from "express";
import { isAuthenticated } from "../middlewares/auth";
import { addCloudServiceProviders, addCloudServiceProvidersSections, addCloudServiceProvidersSectionsTopics, addExams, addQuestions, getCloudServiceProviders, getCloudServiceProvidersSections, getCloudServiceProvidersSectionsTopics, getLevels, getQuestions } from "../controllers/questions/questionsController";
// import { sendOTP, verifyOTP } from "../controllers/auth/otpController";

const router = express.Router();



// ---------------------------------------- Clouds  ------------------------------------------//
router.get("/leadboard", addCloudServiceProviders);

