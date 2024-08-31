"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const questionsController_1 = require("../controllers/questions/questionsController");
// import { sendOTP, verifyOTP } from "../controllers/auth/otpController";
const router = express_1.default.Router();
// ---------------------------------------- Clouds  ------------------------------------------//
router.post("/clouds", questionsController_1.addCloudServiceProviders);
router.get("/clouds", questionsController_1.getCloudServiceProviders);
router.post("/clouds-sections", questionsController_1.addCloudServiceProvidersSections);
router.get("/clouds-sections/:id", questionsController_1.getCloudServiceProvidersSections);
router.post("/clouds-sections-topics", questionsController_1.addCloudServiceProvidersSectionsTopics);
router.get("/clouds-sections-topics/:id", questionsController_1.getCloudServiceProvidersSectionsTopics);
router.post("/add-questions", questionsController_1.addQuestions);
router.post("/add-exams", questionsController_1.addExams);
router.get("/questions", questionsController_1.getQuestions);
router.get("/levels/:id", questionsController_1.getLevels);
exports.default = router;
