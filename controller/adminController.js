const adminSignupModal = require("../models/adminSignupSchema");
const userSignupModel=require("../models/userSignupSchema")
const bcrypt =require("bcrypt");
const flash = require("connect-flash");
const categoryModel = require("../models/addCategorySchema")

//verification of pattern AND password
const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
const gstinRegex = /^[0-9]{2}[A-N]{5}[0-9]{4}[M-P]{1}[1-9A-Z]{1}[Z]{1}[0-9A-Z]{1}$/;

module.exports={
    aLoginGet:(req,res)=>{
        res.render("adminEjsPages/adminLogin")
    },
    aSignupGet:(req,res)=>{
        res.render("adminEjsPages/adminSignup")
    },
    aHomePage:(req,res)=>{
        res.render("adminEjsPages/dashboard")
    },
    aUsersGet:async(req,res)=>{
        const users =await userSignupModel.find({})
        res.render("adminEjsPages/users",{users})
    },
    aProductGet:(req,res)=>{
        res.render("adminEjsPages/adminProducts")
    },
    aCategoryGet:(req,res)=>{
        res.render("adminEjsPages/category")
    },
    aCouponGet:(req,res)=>{
        res.render("adminEjsPages/coupon")
    },
    aOrderGet:(req,res)=>{
        res.render("adminEjsPages/orders")
    },
    aBannerGet:(req,res)=>{
        res.render("adminEjsPages/bannar")
    },
    addProductGet:(req,res)=>{
        res.render("adminEjsPages/addProducts")
    },
    addCategoryGet:(req,res)=>{
        res.render("adminEjsPages/addCategory")
    },
    addCouponGet:(req,res)=>{
        res.render("adminEjsPages/addCoupon")
    },
    addBannerGet:(req,res)=>{
        res.render("adminEjsPages/addBannar")
    },
    aUserDltGet:async(req,res)=>{
        try {
            const _id=req.params.id;
            await userSignupModel.deleteOne({_id})
            res.status(200).redirect("/admin/users")
        } catch (error) {
            
        }
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
                    res.redirect("/admin/home")
                }else{
                    console.log("invalid password");
                }
            }
        } catch (err) {
            console.log("Error occurred", err);
            res.status(500).json({ message: 'Internal Server Error' });
        }
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
                res.redirect("/admin/signup")
            } else if (!emailPattern) {
                req.flash("error","invalid password format")
                res.redirect("/admin/signup")
            }else if(!gstinRegex){
                req.flash("error","invalid gst code format")
                res.redirect("/admin/signup")
            }else if(!passwordPattern){
                req.flash("error","invalid password format")
                res.redirect("/admin/signup")
            }else{
                await newSchema.save()
                res.redirect("/admin/login")
            }
                
            
        } catch (err) {
            console.log(err);
        }
    },
    aUsersPost:(res,req)=>{

    },
    aProductPost:(req,res)=>{

    },
    aCategoryPost:async(req,res)=>{
        
        try {
            console.log("admin in category adding");
            const {categoryName,subCategory}=req.body
            const categoryImage =req.file?.filename
            const newCategory = new categoryModel({
                categoryImage,categoryName,subCategory
            })
            await newCategory.save()

            console.log("category added");
            res.redirect("/admin/category")
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    aCouponPost:(req,res)=>{

    },
    aOrderPost:(req,res)=>{

    },
    aBannerPost:(req,res)=>{

    },
    addProductPost:(req,res)=>{

    },
    addCategoryPost:(req,res)=>{

    },
    addCouponPost:(req,res)=>{

    },
    addBannerPost:(req,res)=>{

    }
    
}