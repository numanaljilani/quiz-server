import express from "express";
import signup from "../controllers/auth/signupController.js";
import { login, me } from "../controllers/auth/loginController.js";
import { resetpassword } from "../controllers/auth/resetPasswordController.js";
import { isAuthenticated } from "../middlewares/auth.js";
// import { sendOTP, verifyOTP } from "../controllers/auth/otpController";

const router = express.Router();

// ---------------------------------------- login for worker ------------------------------------------//
// router.post("/login",signup)


// ---------------------------------------- customers ------------------------------------------//
router.post("/register", signup);

router.post("/login",login)

router.get("/me" ,me )


// enter email and send otp > verify  > resetpassword
// router.post("/send-otp",sendOTP)
// router.post("/verify-otp",verifyOTP)
// router.post("/reset-password",isAuthenticated,resetpassword)




export default router;