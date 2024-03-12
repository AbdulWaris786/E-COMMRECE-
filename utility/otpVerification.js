// const bcrypt =require("bcrypt")
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
    otpGet:(req,res)=>{
        const otpData = req.flash("otpData")[0];
        res.render("user/otp",{otpData})
    },otpPost:async(req,res)=>{
        const {phone,email,whatsapp,Verification}=req.body
        const twiloVerification =Verification
        console.log(req.body);
        console.log(twiloVerification);
        try { 
            if(twiloVerification=="email"){
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
                        // const otpsender ={email,phone,Verification}
                        // req.flash("otpDetails",{otpsender})
                        // res.redirect("/user/otpRecive")
                    } catch (error) {
                        console.log(`error occurred while sending email:${error}`);                        
                    }
                  }
                  sendMail(transporter,mailoption)
            }

            const detailsOtp ={email:email,phone:phone,Verification:Verification}
            console.log(detailsOtp);
            req.flash("otpDetails",detailsOtp)
            res.redirect('/otpRecive')

        } catch (err) {
            console.error('Error sending verification code:', err);
            res.status(500).json({ error: 'Failed to send verification code.' });

        }
        
    },
    otpReciveGet:(req,res)=>{
        // const otpDetails = req.flash("otpDetails")[0];
        res.render("user/otpRecive",{otpDetails:req.flash("otpDetails")[0]})
    },
    otpRecivePost:async(req,res)=>{
        const {otp,email,Verification,phone}=req.body
        const mailerVerification = Verification
         try {
            if(mailerVerification =="email"){
                console.log(mailOtp.otpCode);
                console.log(otp);
                if (otp==mailOtp.otpCode) {
                    const users =await signupData.findOneAndUpdate(
                        {email},
                        {$set:{verify:true}}
                    )
                    res.redirect("/login")
                }else{
                    console.log("nookkii irunnooo ippoo verum tto");
                    res.redirect("/signup")
                }
            }
         } catch (error) {
            console.log(error);
         }

    } 
   
}