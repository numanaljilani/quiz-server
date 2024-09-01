import express from "express";
import signup from "../controllers/auth/signupController";
import { login, me } from "../controllers/auth/loginController";
import { resetpassword } from "../controllers/auth/resetPasswordController";
import { isAuthenticated } from "../middlewares/auth";
import { MiddlewareInterface } from "../interfaces";
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