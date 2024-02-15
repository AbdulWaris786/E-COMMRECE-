const bcrypt =require("bcrypt")
const signupData =require("../models/userSignupSchema")
// const profileModel =require("../models/userAddressSchema")
const flash =require("connect-flash")
// const {accountSid,authToken,verifySid}=require("../server/config/otp_auth")
// const twilio =require("twilio")
// const nodemailer = require("nodemailer");
// const mailOtp =require("../middleware/otpverify")
// const { default: mongoose } = require("mongoose")
// const signupModal = require("../models/userSignupSchema")

//verification of emailAND password
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

module.exports={
//user===========================================================================================

    loginGet:(req,res)=>{
        res.render("user/login")
    },loginPost:async (req,res)=>{
        const {email , password}=req.body   

        try {
                
                
                const user =await signupData.findOne({email})
                
                if(!user){
                    console.log("error occured while finding the user");
                }else{
                    const passwordMatch = await bcrypt.compare(password, user.password);
                    if(passwordMatch){
                        if(user.verify=="true"){
                            console.log("user loggin is sucessfully");
                            req.session.email= email
                            res.redirect("/")
                        }else{
                            console.log("plz verify your email ");
                            res.redirect("/otp")
                        }
                    }else{
                        console.log("plz enter valid passworrd");
                    }
                }
        } catch (error) {
            console.log("Error occurred", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    signupGet:(req,res)=>{
        const error = req.flash('error')
        res.render("user/signup",{error})
    },signupPost:async(req,res)=>{
        //data collection
        const {name,phone,email,password,Verification}=req.body
        console.log(req.body);
        try {
            //bcrypting password

            const bcryptPassword =await bcrypt.hash(password,10)
            req.body.password=bcryptPassword

            //schema setting
            const userSchema =new signupData({
                name,phone,email,
                password:bcryptPassword,
                verify:"false",
                Verification,
                block:"false"   
            })

            //server side validation
            let userData =await signupData.find()
            let existUser=userData.find((val)=>val.email===email)
            if(existUser){
                req.flash("error","user aqlready exist....please login")
                res.redirect("/user/signup")
            }else if(!emailPattern.test(email)){
                req.flash("error","invalid email format")
                res.redirect("/signup")
            }else if(!passwordPattern.test(password)){
                req.flash("error","invalid password formal")
                res.redirect("/signup")
            }else{
                await userSchema.save()
                const dataOtp={email,phone,Verification}
                console.log(dataOtp.Verification);
                req.flash("otpData",dataOtp)
                res.redirect("/otp")
            }

        } catch (err) {
            console.log(err);
        }
    },
//admin========================================================================================
    aLoginGet:(req,res)=>{
        res.render("admin/adminLogin")
    },
    aLoginPost:async(req,res)=>{
        try {
            
            const {email,password}=req.body
            const admin = await adminSignupModal.findOne({email})
            // console.log(admin);
            
            if (!admin){
                console.log("Error occurred while finding the user");
            }else{
                
                const passwordMatch =await bcrypt.compare(password,admin.password)
                
                if(passwordMatch){
                    console.log("admin login sucessfully");
                    req.session.email=email
                    res.redirect("/home")
                }else{
                    console.log("invalid password");
                }
            }
        } catch (err) {
            console.log("Error occurred", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    aSignupGet:(req,res)=>{
        res.render("admin/adminSignup")
    },
    aSignupPost:async(req,res)=>{
        const {name,email,companyName,gstCode,password,confirmpasswword}=req.body
        try {
            const pw =await bcrypt.hash(password,10)
            req.body.password=pw
            const newSchema =new adminSignupModal({
                name,email,companyName,gstCode,
                password:pw
            }) 

            let signupData= await adminSignupModal.find()
            let adimnExist=signupData.find((val)=>val.email == email)
            if (adimnExist) {
                req.flash("error","user already exist.... please login")
                res.redirect("/signup")
            } else if (!emailPattern) {
                req.flash("error","invalid password format")
                res.redirect("/signup")
            }else if(!gstinRegex){
                req.flash("error","invalid gst code format")
                res.redirect("/signup")
            }else if(!passwordPattern){
                req.flash("error","invalid password format")
                res.redirect("/signup")
            }else{
                await newSchema.save()
                res.redirect("/login")
            }
                
            
        } catch (err) {
            console.log(err);
        }
    },
}