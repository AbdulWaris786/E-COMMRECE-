// const adminSignupModal = require("../models/adminSignupSchema");
// const userSignupModel=require("../models/userSignupSchema")
// const userAddressModel =require("../models/userAddressSchema")
// const bcrypt =require("bcrypt");
// const flash = require("connect-flash");
const categoryModel = require("../models/addCategorySchema")
const path=require("path")
const fs =require("fs");
// const { param } = require("../router/adminRouter");
// const { default: mongoose } = require("mongoose");






module.exports={
    aCategoryGet:async(req,res)=>{
        const categorys =await categoryModel.find({})
        console.log(categorys);
        res.render("admin/category",{categorys})
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
                return res.render("admin/category",{categorys})
            }else{
                
                const  existingCategory =await categoryModel.findOne({categoryName})
                if(existingCategory){
                    await categoryModel.findOneAndUpdate(
                        { categoryName : categoryName},
                        {$push:{subCategory:subCategory}},
                        {new:true,upsert:true}
                    )
                    
                        const categorys= await categoryModel.find()
                        return res.render("admin/category",{categorys})
                }else{
                    
                    const newCategory=new categoryModel({
                        categoryImage,
                        categoryName,
                        subCategory
                    })
                    await newCategory.save()
                    const categorys= await categoryModel.find()
                    return res.render("admin/category",{categorys})
                }
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
    addCategoryGet:(req,res)=>{
        res.render("admin/addCategory")
    },
    addCategoryPost:(req,res)=>{

    },
    aCategoryEditGet:async(req,res)=>{
        try {
            const category =await categoryModel.findById(req.params.id)
            if(!category){
                return res.status(404).send("product not found")
            }else{
                res.render("admin/editCategory",{category})
            }
        } catch (error) {
            console.error(error);
            res.status(500).send("server error")
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
}