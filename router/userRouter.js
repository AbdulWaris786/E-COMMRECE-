const express = require("express")
const router = express.Router()
const authController =require("../controller/authController")
const otpVerification =require("../utility/otpVerification")
const forgotPassword =require("../utility/forgotPassword")

const {
    
    homePageGet,
    addressAddGet,addressAddPost
}= require("../controller/userController")

router.get("/login",authController.loginGet)
router.post("/login",authController.loginPost)

router.get("/signup",authController.signupGet)
router.post("/signup",authController.signupPost)

router.get("/otp",otpVerification.otpGet)
router.post("/otp",otpVerification.otpPost)

router.get("/otpRecive",otpVerification.otpReciveGet)
router.post("/otpRecive",otpVerification.otpRecivePost)

router.get("/forgotPassword",forgotPassword.forgotPasswordGet)
router.post("/forgotPassword",forgotPassword.forgotPasswordPost)

router.get("/newPassword",forgotPassword.newPasswordGet)
router.post("/newPassword",forgotPassword.newPasswordPost)

router.get("/forgotOtp",forgotPassword.forgotOtpGet)
router.post("/forgotOtp",forgotPassword.forgotOtpPost)


router.get("/",homePageGet)
    .get("/addressAdd",addressAddGet)
    .post("/addressAdd",addressAddPost)

module.exports=router