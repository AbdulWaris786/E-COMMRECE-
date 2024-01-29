const express = require("express")
const router = express.Router()

const {
    loginGet,signupGet,home,signupPost,otpGet,otpPost
}= require("../controller/userController")


router.get("/user/login",loginGet)
    .get("/user/signup",signupGet)
    .get("/",home)
    .get("/user/otp",otpGet)
    .post("/user/signup",signupPost)
    .post("/user/otp",otpPost)
    



module.exports=router