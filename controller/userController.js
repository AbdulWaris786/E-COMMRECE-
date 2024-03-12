const signupData =require("../models/userSignupSchema")
const profileModel =require("../models/userAddressSchema")
const flash =require("connect-flash")
const { default: mongoose } = require("mongoose")
const signupModal = require("../models/userSignupSchema")

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
            if (!userData) {
                res.redirect("/login")
            }else{
                const obj =userData._id
                res.render("user/userAddressAdd",{obj}); 
            }
            
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    addressAddPost:async(req,res)=>{
        const users=req.body
        const userId =req.session.email
        const obj = req.params.id
        const {firstName,lastName,phone,streetAddress,country,state,city,pinCode}=users
        if(!userId){
            return res.status(404).send("User not found");
        }else{
            try {
                const userExist =await profileModel.findOne({userId})
                if(userExist){
                    userExist.addresses.push({
                        firstName,lastName,
                        phone,streetAddress,
                        country,state,
                        city,pinCode
                    })
                    await userExist.save();
                    
                }else{
                    const newUser =new profileModel({
                        userId,
                        addresses:[{
                            firstName,lastName,
                            phone,streetAddress,
                            country,state,
                            city,pinCode
                        }],
                        obj

                    })
                    await newUser.save()
                }
                res.redirect('/')
            } catch (error) {
                console.log(error);
            }

        }

        
    }
}