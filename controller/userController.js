const bcrypt =require("bcrypt")
const signupData =require("../models/userSignupSchema")
const profileModel =require("../models/userAddressSchema")
const flash =require("connect-flash")
const {accountSid,authToken,verifySid}=require("../server/config/otp_auth")
const twilio =require("twilio")
const nodemailer = require("nodemailer");
const mailOtp =require("../middleware/otpverify")
const { default: mongoose } = require("mongoose")
const signupModal = require("../models/userSignupSchema")


//otp sending in SMS
const client = twilio(accountSid, authToken);

//verification of emailAND password
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

module.exports={
    
    signupGet:(req,res)=>{
        const error = req.flash('error')
        res.render("userEjsPages/signup",{error})
    },
    loginGet:(req,res)=>{
        res.render("userEjsPages/login")
    },
    otpGet:(req,res)=>{
        const otpData = req.flash("otpData")[0];
        res.render("userEjsPages/otp",{otpData})
    },
    otpReciveGet:(req,res)=>{
        // const otpDetails = req.flash("otpDetails")[0];
        res.render("userEjsPages/otpRecive",{otpDetails:req.flash("otpDetails")[0]})
    },
    homePageGet:(req,res)=>{
        res.render("userEjsPages/home")
    },
    forgotPasswordGet:(req,res)=>{
        res.render("userEjsPages/forgotPassword")
    },
    forgotOtpGet:(req,res)=>{
        res.render("userEjsPages/forgotOtp")
    },
    newPasswordGet:(req,res)=>{
        res.render("userEjsPages/enterNewPassword")
    },
    addressAddGet: async (req, res) => {
        try {
            const email = req.session.email;
            const userData = await signupData.findOne({ email });
    
            // Check if userData is null (no user found with the provided email)
            if (!userData) {
                return res.status(404).send("User not found");
            }
    
            const obj = new mongoose.Types.ObjectId(userData._id);
            const userDetails = await signupData.aggregate([
                {
                    $match: { _id: obj }
                },
                {
                    $lookup: {
                        from: "userAddressdetails",
                        localField: '_id',
                        foreignField: 'obj',
                        as: 'address'
                    }
                }
            ]);
    
            const fullData = userDetails[0];
            
            res.render("userEjsPages/userAddressAdd", { fullData });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    
    
    signupPost:async(req,res)=>{
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
                Verification
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
                const dataOtp={email,phone,Verification}
                console.log(dataOtp.Verification);
                req.flash("otpData",dataOtp)
                res.redirect("/user/otp")
            }

        } catch (err) {
            console.log(err);
        }
    },
    otpPost:async(req,res)=>{
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
            res.redirect('/user/otpRecive')

        } catch (err) {
            console.error('Error sending verification code:', err);
            res.status(500).json({ error: 'Failed to send verification code.' });

        }
        
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
                    res.redirect("/user/login")
                }else{
                    console.log("nookkii irunnooo ippoo verum tto");
                    res.redirect("/user/signup")
                }
            }
         } catch (error) {
            console.log(error);
         }

    },
    loginPost:async (req,res)=>{
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
                            res.redirect("/user/otp")
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
                      
                      res.redirect("/user/forgotOtp")
                }
        } catch (err) {
            console.error('Error sending verification code:', err);
            res.status(500).json({ error: 'Failed to send verification code.' });

        }
    },
    forgotOtpPost:async(req,res)=>{
        const {otp}=req.body
        console.log(otp);
        try {
            
                console.log(mailOtp.otpCode);
                console.log(otp);
                if (otp==mailOtp.otpCode) {
                    res.redirect("/user/newPassword")
                }else{
                    console.log("nookkii irunnooo ippoo verum tto");
                    res.redirect("/user/signup")
                }
    
         } catch (error) {
            console.log(error);
         }
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
                    res.redirect("/user/login")
                });
            }else{
                res.status(400).redirect("/user/newPassword")
            }
        } catch (err) {
            console.error(err.message,"reset password post error");
            res.status(500).send("internal server error")
        }
    },
    addressAddPost:async(req,res)=>{
        const users=req.body
        const email =req.session.email
        console.log(email); 
        const userData =await signupModal.findOne({email})
        console.log(userData);
        const obj= new mongoose.Types.ObjectId(userData._id)
        const {firstName,lastName,phone,streetAddress,country,state,city,pinCode}=users
        if(!userData){
            return res.status(404).send("User not found");
        }else{
            await profileModel.updateOne(
                {obj:obj},
                {
                    $set:{firstName,lastName,phone,streetAddress,country,state,city,pinCode}
                },
            {
                upsert:true
            }
             )
             res.redirect('/')
        }

        
    }
}