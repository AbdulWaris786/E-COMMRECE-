const express = require("express")
const router = express.Router()
const authController =require("../controller/authController")
const otpVerification =require("../utility/otpVerification")
const forgotPassword =require("../utility/forgotPassword")
const productController=require("../controller/productController")
const userController = require("../controller/userController")


//user login
router.get("/login",authController.loginGet)
router.post("/login",authController.loginPost)

//user signup
router.get("/signup",authController.signupGet)
router.post("/signup",authController.signupPost)

//user otp verifivation
router.get("/otp",otpVerification.otpGet)
router.post("/otp",otpVerification.otpPost)
router.get("/otpRecive",otpVerification.otpReciveGet)
router.post("/otpRecive",otpVerification.otpRecivePost)

//user forgot password
router.get("/forgotPassword",forgotPassword.forgotPasswordGet)
router.post("/forgotPassword",forgotPassword.forgotPasswordPost)
router.get("/newPassword",forgotPassword.newPasswordGet)
router.post("/newPassword",forgotPassword.newPasswordPost)
router.get("/forgotOtp",forgotPassword.forgotOtpGet)
router.post("/forgotOtp",forgotPassword.forgotOtpPost)

// user profile details
router.get("/addressAdd",userController.addressAddGet)
router.post("/addressAdd",userController.addressAddPost)
router.get("/",userController.homePageGet)

// user product controller 

router.get("/womens",productController.womenProductGet)
router.get("/mens",productController.menProductGet)
router.get("/phones",productController.phonesGet)
router.get("/shoes",productController.shoesGet)


module.exports=router