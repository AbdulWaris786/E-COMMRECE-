const userSignupModel=require("../models/userSignupSchema")
const userAddressModel =require("../models/userAddressSchema")
const bannerModel =require("../models/addBannerSchema")
const couponModel =require("../models/addCouponSchema")
const flash = require("connect-flash");
const path=require("path")
const fs =require("fs");
const { param } = require("../router/adminRouter");
const { default: mongoose } = require("mongoose");
const productModel =require("../models/addProductSchema")
const orderModel =require("../models/orderProductsSchema")

module.exports={
    
    aHomePage:async(req,res)=>{
            const product =await productModel.aggregate([
                {
                    $group: {
                        _id: "$category",
                        count: { $sum: 1 }
                    }
                }
            ]);
            
            // Extract category names and counts into separate arrays
            const categories = [];
            const counts = [];  
            
            product.forEach(item => {
                const category = encodeURIComponent(item._id); // Encode category name
                




                categories.push(category);
                counts.push(item.count);
            });
            const orderData = await orderModel.aggregate([
                {
                    $group:{
                        _id:'$paymentMethod',
                        count :{$sum:1}
                    }
                }
                
            ])
            const dataOrder =await orderModel.aggregate([
                {
                    $group:{
                        _id:'$coupon',
                        count:{$sum:1}
                    }  
                }
            ])
            const couponCounts =[]
            const paymentMethod =[]
            const Counts =[]
            const Coupon =[]
            orderData.forEach(item=>{
                const method = encodeURIComponent(item._id)
                console.log(method);
                paymentMethod.push(method)
                Counts.push(item.count)
            })
            dataOrder.forEach(item=>{
                const method = encodeURIComponent(item._id)
                console.log(method);
                Coupon.push(method)
                couponCounts.push(item.count)
            })
           
            const paymentType = [...Coupon,...paymentMethod]
            const paymentTypeCount =[...couponCounts,...Counts]
            res.render("admin/dashboard", { categories, counts ,paymentType,paymentTypeCount});
    },
    UsersGet:async(req,res)=>{
        const users =await userSignupModel.find({block:false})
        res.render("admin/users",{users})
    },
    
    aOrderGet:async(req,res)=>{
        const orderData = await orderModel.find({}).populate('products.product')
        res.render("admin/orders",{orderData})
    },
    orderUpdatePost:async(req,res)=>{
        try {
            const {selectedValue,orderId}=req.body
            console.log(selectedValue,orderId);
            const updateStatus =await orderModel.findOneAndUpdate(
                {
                    _id:orderId,
                },
                {
                    $set:{               
                        status:selectedValue
                    }
                }
            )
            if(updateStatus){
                res.status(200).json({success:true})
            }else{
                res.status(500).json({success:false})
            }
        } catch (error) {
            console.log(error);
        }
    },
    UserDetailsGet:async(req,res)=>{
        const obj=req.params.id

        const address =await userAddressModel.findOne({obj:obj})
        console.log(address);
        try {
            if(!address){
                res.render("admin/notFound")
            }else{
                res.render("admin/userDetails",{address})
            }
        } catch (error) {
            console.log(error);
        }
    },
    blockGet:async(req,res)=>{
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
    userdlt:async(req,res)=>{
        try {
            const _id =req.params.id
            const deleteUser =await userSignupModel.findByIdAndDelete(_id)
            if(deleteUser){
                res.status(200).json({ message: 'banner deleted successfully' });
            }else{
                res.status(404).json({ message: 'Category not found or already deleted' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
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
                res.status(404).json({ message: 'banner not found or already deleted' });
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
    },
    adminLogout:(req,res)=>{
        req.session.destroy(()=>{
            res.redirect("/admin/login")
        })
    }
}