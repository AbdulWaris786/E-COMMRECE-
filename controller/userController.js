const bcrypt =require("bcrypt")
const signupData =require("../models/userSignupSchema")
const flash =require("connect-flash")
const twilio =require("twilio")
const otpGenretor =require("otp-generator")
const {accountSid,authToken,verifySid}=require("../server/config/otp_auth")

//verification of pattern AND password
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

//otp contents

// const accountSid = 'ACf1437a6304c8bd14d1ed5f1f2947c03f';
// const authToken = 'b44dbddbf476dde2043b5976eda8933c';
// const verifySid ="3YV5SKXCZ5YRXP1RSTP5C6UH"
const client = twilio(accountSid, authToken);

module.exports={
    loginGet:(req,res)=>{
        res.render("login")
    },
    signupGet:(req,res)=>{
        const error = req.flash('error')
        res.render("signup",{error})
    },
    home:(req,res)=>{
        res.render("home")
    },
    otpGet:(req,res)=>{
        const otpData = req.flash("otpData")[0];
        res.render("otp",{otpData})
    },
    signupPost:async(req,res)=>{
        const {name,phone,email,password}=req.body   // data collecting
        try {
            const pw =await bcrypt.hash(password,10)
            req.body.password=pw                     // bcrypt the password
            const userSchema =new signupData({         //  schema will setting
                name,phone,email,
                password:pw,
                verify:"false"
            })
            //server side validation
            let userData =await signupData.find()
            let existUser=userData.find((val)=>val.email===email)
            if(existUser){
                req.flash("error","user aqlready exist....please login")
                res.redirect("/user/signup")
            }else if(!emailPattern.test(email)){
                req.flash("error","invalid email format")
                res.redirect("/user/signup")
            }else if(!passwordPattern.test(password)){
                req.flash("error","invalid password formal")
                res.redirect("/user/signup")
            }else{
                await userSchema.save()
                const dataOtp={email,phone}
                req.flash("otpData",dataOtp)
                res.redirect("/user/otp")
            }

        } catch (error) {
            console.log(error);
        }
    },
    otpPost:async(req,res)=>{
        const {phone,email,whatsapp}=req.body
        const twilioPhone = {phone};
        const otp=otpGenretor.generate(6,{digits:true,lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
        const resNumber=req.body.phone
        // client.messages  
        // .create({
        //     body:`YOUR OTP IS: ${otp} never share this OTP in others`,
        //     from:twilioPhone,
        //     to:resNumber
        // })
        // .then(message=>{
        //     console.log("OTP sent",message.sid);
        //     res.json({ success: true, message: 'OTP sent successfully' })
        // })
        // .catch(err=>{
        //     console.error("ERROR sending OTP",err);
        //     res.status(500).json({ success: false, message: 'Error sending OTP' });
        // })
        /////////////////////////////////////////
        // client.verify.v2
        //     .services(verifySid)
        //     .verifications.create({ to: `+91${twilioPhone}`, channel: "sms" })
        //     // .then((verification) => console.log(verification.status))
        //     .then((resp)=>{
        //         console.log("response",resp);
        //         res.status(200).json(resp)
        //     })
            // .then(() => {
        // const readline = require("readline").createInterface({
        //     input: process.stdin,
        //     output: process.stdout,
        // });
        // readline.question("Please enter the OTP:", (otpCode) => {
        // client.verify.v2
        //     .services(verifySid)
        //     .verificationChecks.create({ to: "+919846619245", code: otpCode })
        //     .then((verification_check) => console.log(verification_check.status))
        //     .then(() => readline.close());
        // });
        // });

    }
   


}