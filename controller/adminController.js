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
    
    aHomePage:(req,res)=>{
        res.render("admin/dashboard")
    },
    aUsersGet:async(req,res)=>{
        const users =await userSignupModel.find({})
        res.render("admin/users",{users})
    },
    aProductGet:(req,res)=>{
        res.render("admin/adminProducts")
    },
    
    aCouponGet:(req,res)=>{
        res.render("admin/coupon")
    },
    aOrderGet:(req,res)=>{
        res.render("admin/orders")
    },
    aBannerGet:(req,res)=>{
        res.render("admin/bannar")
    },
    addProductGet:(req,res)=>{
        res.render("admin/addProducts")
    },
    
    addCouponGet:(req,res)=>{
        res.render("admin/addCoupon")
    },
    addBannerGet:(req,res)=>{
        res.render("admin/addBannar")
    },
    aUserDetailsGet:async(req,res)=>{
        const obj=req.params.id
        const address =await userAddressModel.findOne({obj})
        console.log(address);
        res.render("admin/userDetails",{address})
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
    
   
    
    aUsersPost:(res,req)=>{

    },
    aProductPost:(req,res)=>{

    },
    
    
    aCouponPost:(req,res)=>{

    },
    aOrderPost:(req,res)=>{

    },
    aBannerPost:(req,res)=>{

    },
    addProductPost:(req,res)=>{

    },
    
    addCouponPost:(req,res)=>{

    },
    addBannerPost:(req,res)=>{

    }
    
}