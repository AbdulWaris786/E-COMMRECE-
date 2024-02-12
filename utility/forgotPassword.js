const bcrypt =require("bcrypt")
const signupData =require("../models/userSignupSchema")
// const profileModel =require("../models/userAddressSchema")
const flash =require("connect-flash")
// const {accountSid,authToken,verifySid}=require("../server/config/otp_auth")
// const twilio =require("twilio")
const nodemailer = require("nodemailer");
const mailOtp =require("../middleware/otpverify")
// const { default: mongoose } = require("mongoose")
// const signupModal = require("../models/userSignupSchema")






module.exports={
    forgotPasswordGet:(req,res)=>{
        res.render("userEjsPages/forgotPassword")
    },
    forgotPasswordPost:async(req,res)=>{
        const {email}=req.body
        console.log(req.body)
        try { 
                const account =await signupData.findOne({email})
    
                if(account){
                    req.session.email =email
                    const transporter = nodemailer.createTransport({
                        service:"gmail",
                         auth: {
                           // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                           user: "warismuthuparamba@gmail.com",
                           pass: "cmdi tirs nfrf fdmh",
                         },
                       });
    
                    const mailoption = 
                    {
                        from: 'warismuthuparmba@gmail.com', // sender address
                        to: email, // list of receivers
                        subject: 'inna pidichoo  OTP ',
                        text: `YOUR OTP IS ${mailOtp.otpCode}`
                        
                      };
                      const sendMail = async (transporter,mailoption)=>{
                        try {
                            await transporter.sendMail(mailoption)
                            console.log("your otp sending is sucessfully");
                        } catch (error) {
                            console.log(`error occurred while sending email:${error}`);                        
                        }
                      }
                      sendMail(transporter,mailoption)
                      
                      res.redirect("/forgotOtp")
                }
        } catch (err) {
            console.error('Error sending verification code:', err);
            res.status(500).json({ error: 'Failed to send verification code.' });
    
        }
    },
    newPasswordGet:(req,res)=>{
        res.render("userEjsPages/enterNewPassword")
    },
    newPasswordPost:async(req,res)=>{
        const {newPassword,confirmPassword}=req.body
        try {
            const email =req.session.email
            const verifyPassword =newPassword===confirmPassword
            const accTrue = await signupData.findOne({email})
            if(verifyPassword && accTrue){
                const salt =await bcrypt.genSalt(10)
                const hashedPassword =await bcrypt.hash(confirmPassword,salt)
                await signupData.updateOne(
                    {email},
                    {
                        $set:{
                            password:hashedPassword,
                            verify:true
                        }
                    }
                );
                req.session.destroy((err)=>{
                    if(err){
                        console.error("error destory session:",err);
                    }else{
                        console.log("Session deleted successfully");
                    }
                    res.redirect("/login")
                });
            }else{
                res.status(400).redirect("/user/newPassword")
            }
        } catch (err) {
            console.error(err.message,"reset password post error");
            res.status(500).send("internal server error")
        }
    },
    forgotOtpGet:(req,res)=>{
        res.render("userEjsPages/forgotOtp")
    },
    forgotOtpPost:async(req,res)=>{
        const {otp}=req.body
        console.log(otp);
        try {
            
                console.log(mailOtp.otpCode);
                console.log(otp);
                if (otp==mailOtp.otpCode) {
                    res.redirect("/newPassword")
                }else{
                    console.log("nookkii irunnooo ippoo verum tto");
                    res.redirect("/signup")
                }
    
         } catch (error) {
            console.log(error);
         }
    },
}