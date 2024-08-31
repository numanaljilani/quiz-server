"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const signupController_1 = __importDefault(require("../controllers/auth/signupController"));
const loginController_1 = require("../controllers/auth/loginController");
// import { sendOTP, verifyOTP } from "../controllers/auth/otpController";
const router = express_1.default.Router();
// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)
// ---------------------------------------- customers ------------------------------------------//
router.post("/register", signupController_1.default);
router.post("/login", loginController_1.login);
router.get("/me", loginController_1.me);
// enter email and send otp > verify  > resetpassword
// router.post("/send-otp",sendOTP)
// router.post("/verify-otp",verifyOTP)
// router.post("/reset-password",isAuthenticated,resetpassword)
exports.default = router;
