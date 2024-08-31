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
router.get("/leadboard", questionsController_1.addCloudServiceProviders);
