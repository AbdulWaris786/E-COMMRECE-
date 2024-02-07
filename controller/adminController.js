const adminSignupModal = require("../models/adminSignupSchema");
const userSignupModel=require("../models/userSignupSchema")
const userAddressModel =require("../models/userAddressSchema")
const bcrypt =require("bcrypt");
const flash = require("connect-flash");
const categoryModel = require("../models/addCategorySchema")
const path=require("path")
const fs =require("fs");
const { param } = require("../router/adminRouter");
const { default: mongoose } = require("mongoose");

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
    aCategoryGet:async(req,res)=>{
        const categorys =await categoryModel.find({})
        console.log(categorys);
        res.render("adminEjsPages/category",{categorys})
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
    aUserDetailsGet:async(req,res)=>{
        const obj=req.params.id
        const address =await userAddressModel.findOne({obj})
        console.log(address);
        res.render("adminEjsPages/userDetails",{address})
    },
    aCategoryDltGet:async(req,res)=>{
        try {
            const _id=req.params.id;
            console.log(_id,"fdf");
            const deleteCategory =await categoryModel.findByIdAndDelete(_id)
            if(deleteCategory){
                const oldImagePath = path.join(__dirname,'../public/uploads/category',deleteCategory.categoryImage)
                fs.unlinkSync(oldImagePath)
                res.status(200).redirect("/admin/category")
            }else{
                res.status(400).json({message:'Can not delete the coupon'}) 
            }
        } catch (error) {
            console.log(error);
        }
    },
    aUserDltGet:async(req,res)=>{
        try {
            const _id=req.params.id;
            await userSignupModel.deleteOne({_id})
            res.status(200).redirect("/admin/users")
        } catch (error) {
            console.log(error);
        }
    },
    aCategoryEditGet:async(req,res)=>{
        try {
            const category =await categoryModel.findById(req.params.id)
            if(!category){
                return res.status(404).send("product not found")
            }else{
                res.render("adminEjsPages/editCategory",{category})
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("server error")
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
        
        // try {
        //     console.log("admin in category adding");
        //     const {categoryName,subCategory}=req.body
        //     const categoryImage =req.file?.filename
        //     const newCategory = new categoryModel({
        //         categoryImage,categoryName,subCategory
        //     })
        //     await newCategory.save()

        //     console.log("category added");
        //     res.redirect("/admin/category")
        // } catch (error) {
        //     console.error(error);
        //     res.status(500).json({ message: 'Internal Server Error' });
        // }
        try {
            const {categoryName,subCategory}=req.body
            const categoryImage =req.file?.filename
            console.log(req.body);
            if (!categoryName||!subCategory) {
                
                const categorys =await categoryModel.find()
                return res.render("adminEjsPages/category",{categorys})
            }else{
                
                const  existingCategory =await categoryModel.findOne({categoryName})
                if(existingCategory){
                    await categoryModel.findOneAndUpdate(
                        { categoryName : categoryName},
                        {$push:{subCategory:subCategory}},
                        {new:true,upsert:true}
                    )
                    
                        const categorys= await categoryModel.find()
                        return res.render("adminEjsPages/category",{categorys})
                }else{
                    
                    const newCategory=new categoryModel({
                        categoryImage,
                        categoryName,
                        subCategory
                    })
                    await newCategory.save()
                    const categorys= await categoryModel.find()
                    return res.render("adminEjsPages/category",{categorys})
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    aCategoryEditPost:async(req,res)=>{
        try {
            const {categoryName,subCategory}=req.body
            const categoryImage=req.file?.filename
            console.log(req.body);
            
            await categoryModel.findByIdAndUpdate( req.params.id,{categoryImage,categoryName,subCategory})
            res.redirect("/admin/category")
        } catch (error) {
            console.error(error);
            res.status(500).send("server error")   
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