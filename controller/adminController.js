const adminSignupModal = require("../models/adminSignupSchema");
const userSignupModel=require("../models/userSignupSchema")
const userAddressModel =require("../models/userAddressSchema")
const bannerModel =require("../models/addBannerSchema")
const couponModel =require("../models/addCouponSchema")
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
    UsersGet:async(req,res)=>{
        const users =await userSignupModel.find({block:false})
        res.render("admin/users",{users})
    },
    aProductGet:(req,res)=>{
        res.render("admin/adminProducts")
    },
    aOrderGet:(req,res)=>{
        res.render("admin/orders")
    },
    
    addProductGet:(req,res)=>{
        res.render("admin/addProducts")
    },
    UserDetailsGet:async(req,res)=>{
        const obj=req.params.id
        const address =await userAddressModel.findOne({obj})
        res.render("admin/userDetails",{address})
    },
    UserDltGet:async(req,res)=>{
        try {
            const _id=req.params.id;
            console.log(_id);
            if(_id){
                const users =await userSignupModel.findByIdAndUpdate(
                    {_id},
                    {$set:{block:true}}
                )
                res.status(200).json({ message: 'User Blocked successfully' })
            }else{
                res.status(404).json({ message: 'Category not found or already deleted' });
                console.log("oon block ayyit illa");
                res.redirect("/admin/users")
            }
            
        } catch (error) {
            console.log(error);
        }
    },
    blockedUser:async(req,res)=>{
        const users =await userSignupModel.find({block:true})
        res.render("admin/blockedUsers",{users})
    },
    unblockUser:async(req,res)=>{
        try {
            const _id =req.params.id
            if(_id){
                const users = await userSignupModel.findByIdAndUpdate(
                    {_id},
                    {$set:{block:false}}
                )
                res.status(200).json({ message: 'User Unblocked successfully' })
            }
        } catch (error) {
                res.status(404).json({ message: 'Category not found or already deleted' });
                console.log("oon unblock ayyit illa");
                res.redirect("/admin/users")
        }
    },
    aBannerGet:async(req,res)=>{
        const banner = await bannerModel.find({})
        res.render("admin/bannar",{banner})
    },
    addBannerGet:async(req,res)=>{
        res.render("admin/addBannar")
    },
    addBannerPost:async(req,res)=>{
        try {
            const {bannerProduct,bannerHeading,specialPrice,startingDate,endingDate}=req.body
            const bannerImage=req.file?.filename
            const newBanner = new bannerModel({
                bannerImage,
                bannerProduct,bannerHeading,
                specialPrice,startingDate,endingDate
            })
            await newBanner.save()
            res.redirect("/admin/banner")
        } catch (error) {
            console.error(error);
        }
    },
    bannerDlt:async(req,res)=>{
        try {
            const _id =req.params.id;
            
            const deleteBanner =await bannerModel.findByIdAndDelete(_id)
            if(deleteBanner){
                const oldImagePath =path.join(__dirname, '../public/uploads/banner',deleteBanner.bannerImage);
                if(oldImagePath){
                    fs.unlinkSync(oldImagePath)
                    res.status(200).json({ message: 'banner deleted successfully' })
                }else{
                    res.status(200).json({ message: 'banner deleted successfully' });
                }
            }else{
                res.status(404).json({ message: 'Category not found or already deleted' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    couponGet:async(req,res)=>{
        const coupon = await couponModel.find({})
        res.render("admin/coupon",{coupon})
    },
    addCouponGet:(req,res)=>{
        res.render("admin/addCoupon")
    },
    addCouponPost:async(req,res)=>{
        try {
            const {couponName,couponCode,discount,purchaceAbove,startingDate,endingDate}=req.body
            const newCoupon =new couponModel({
                couponName,couponCode,
                discount,purchaceAbove,
                startingDate,endingDate
            })
            await newCoupon.save()
            res.redirect("/admin/coupons")
        } catch (error) {
            console.error(error);
        }

    },
    couponDlt:async(req,res)=>{
        try {
            const _id =req.params.id
            const deleteCoupon = await couponModel.findByIdAndDelete(_id)
            if(deleteCoupon){
                res.status(200).json({ message: 'banner deleted successfully' });
            }else{
                res.status(404).json({ message: 'Category not found or already deleted' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}