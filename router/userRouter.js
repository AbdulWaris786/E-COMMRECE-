const express = require("express")
const router = express.Router()

const {
    loginGet,loginPost,
    signupGet,homePageGet,signupPost,
    otpGet,otpPost,
    otpReciveGet,otpRecivePost,
    forgotPasswordGet,forgotPasswordPost,
    newPasswordGet,newPasswordPost,
    forgotOtpGet,forgotOtpPost
}= require("../controller/userController")


router.get("/user/login",loginGet)
    .get("/user/signup",signupGet)
    .get("/",homePageGet)
    .get("/user/otp",otpGet)
    .get("/user/otpRecive",otpReciveGet)
    .get("/user/forgotPassword",forgotPasswordGet)
    .get("/user/newPassword",newPasswordGet)
    .get("/user/forgotOtp",forgotOtpGet)



    .post("/user/login",loginPost)
    .post("/user/signup",signupPost)
    .post("/user/otp",otpPost)
    .post("/user/otpRecive",otpRecivePost)
    .post("/user/forgotPassword",forgotPasswordPost)
    .post("/user/newPassword",newPasswordPost)
    .post("/user/forgotOtp",forgotOtpPost)
    



module.exports=router