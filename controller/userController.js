// const bcrypt =require("bcrypt")
const signupData =require("../models/userSignupSchema")
const profileModel =require("../models/userAddressSchema")
const flash =require("connect-flash")
// const {accountSid,authToken,verifySid}=require("../server/config/otp_auth")
// const twilio =require("twilio")
// const nodemailer = require("nodemailer");
// const mailOtp =require("../middleware/otpverify")
const { default: mongoose } = require("mongoose")
const signupModal = require("../models/userSignupSchema")


//otp sending in SMS
// const client = twilio(accountSid, authToken);

//verification of emailAND password
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

module.exports={
    homePageGet:(req,res)=>{
        res.render("user/home")
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
            
            res.render("user/userAddressAdd", { fullData });
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
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