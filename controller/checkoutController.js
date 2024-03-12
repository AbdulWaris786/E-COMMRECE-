const addressModel =require("../models/userAddressSchema");
const userModel =require("../models/userSignupSchema");

module.exports={
    checkoutGet:async(req,res)=>{
        const userId =req.session.email
        try {
            if(!userId){
                res.redirect("/login")
            }else{
                const id = req.params.id
                const user = await userModel.findOne({email:userId})
                const obj = user._id 
                const address =await addressModel.findOne({userId})
                res.render("user/checkout",{address})
            }
        } catch (error) {
            console.log(error);
        }
    }
}