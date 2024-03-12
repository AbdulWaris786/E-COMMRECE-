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
    aCategoryDltGet : async (req, res) => {
        try {
            const _id = req.params.id;
            console.log(_id, "fdf");
            const deleteCategory = await categoryModel.findByIdAndDelete(_id);
            if (deleteCategory) {
                const oldImagePath = path.join(__dirname, '../public/uploads/category', deleteCategory.categoryImage);
                if (oldImagePath) {
                    fs.unlinkSync(oldImagePath);
                    // Send success response with status 200
                    res.status(200).json({ message: 'Category deleted successfully' });
                } else {
                    // If the image path doesn't exist, still consider it as successful deletion
                    res.status(200).json({ message: 'Category deleted successfully' });
                }
            } else {
                // If the category couldn't be found or deleted, respond with status 404
                res.status(404).json({ message: 'Category not found or already deleted' });
            }
        } catch (error) {
            console.error(error);
            // If an error occurs during deletion, respond with status 500
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}