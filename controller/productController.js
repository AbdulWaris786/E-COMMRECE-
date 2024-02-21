const productModel = require("../models/addProductSchema")
const path=require("path")
const fs =require("fs");



module.exports={
    ProductGet: async(req,res)=>{
        const products =await productModel.find({})
        res.render("admin/adminProducts",{products})
    },
    addProductGet:(req,res)=>{
        res.render("admin/addProducts")
    },
    addproductPost:async(req,res)=>{
        try {
            const {productName,newPrice,oldPrice,category,subCategory,colour,size,quantity,description}=req.body
            // const productImage =req.file?.filename  
            let productImages = [];
                if (req.files) {
                    req.files.forEach(file => {
                        productImages.push(file.filename);
                    });
                }
            console.log(req.body);
            const newProduct =new productModel({
                productName,newPrice,
                oldPrice,category,
                subCategory,colour,
                size,quantity,description,
                productImages
            })      
            await newProduct.save()
            res.redirect("/admin/product")
        } catch (error) {
            console.error(error);
        }
    },
    productDelete : async (req, res) => {
        try {
            const _id = req.params.id;
            const product = await productModel.findByIdAndDelete(_id);
            if (product) {
                if (product.productImages && product.productImages.length > 0) {
                    product.productImages.forEach(imagePath => {
                        const oldImagePath = path.join(__dirname, "../public/uploads/products", imagePath);
                        try {
                            if (fs.existsSync(oldImagePath)) {
                                fs.unlinkSync(oldImagePath);
                            }
                        } catch (error) {
                            console.error("Error deleting image:", error);
                        }
                    });
                }
                res.status(200).json({ message: 'Product and associated images deleted successfully' });
            } else {
                res.status(404).json({ message: 'Product not found or already deleted' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    editProductGet:async(req,res)=>{
        try {
            const product = await productModel.findById(req.params.id)
            
            if(!product){
                return res.status(404).send("product not found")
            }
            res.render("admin/editProduct",{product})
        } catch (error) {
            console.error(error);
            res.status(500).send("server error") 
        }
    },
    editProductPatch:async(req,res)=>{
        try {
            const id= req.params.id
            const product = await productModel.findOne({_id:id})
            const {productName,newPrice,oldPrice,category,subCategory,colour,size,quantity,description}=req.body
            const oldImageArray = product.productImages
            const productImages=req.files ? req.files.map((file)=>file.filename):oldImageArray
            if(req.files.length == 0){
                const upadetWithOldArray =await productModel.findOneAndUpdate(
                    {_id:id},
                    {$set:{
                        productName,newPrice,
                        oldPrice,category,subCategory,
                        colour,size,quantity,description,productImages
                    }}
                )
                if(upadetWithOldArray){
                     res.status(200).redirect("/admin/product")
                }else{
                     res.status(290).redirect("/admin/product")
                }
            }else{
                const updatedWithnewArray =await productModel.findOneAndUpdate(
                    {_id:id},
                    {$set:{
                        productName,newPrice,
                        oldPrice,category,subCategory,
                        colour,size,quantity,description,productImages
                    }}
                )
                if(updatedWithnewArray){
                    oldImageArray.forEach(async image=>{
                        await fs.unlinkSync(`./public/uploads/products/${image}`)
                    })
                    
                    res.status(200).redirect("/admin/product")
                }else{
                   
                     res.status(290).redirect("/admin/product")
                }
            }

        } catch (error) {
            console.log(error);
        }
    },
    //user ======================================================
    womenProductGet:async(req,res)=>{
        const Product = await productModel.find({category:"women"})
        res.render("user/userProducts",{Product})
    },
    menProductGet:async(req,res)=>{
        const Product =await productModel.find({category:"mens"})
        res.render("user/userProducts",{Product})
    },
    phonesGet:async(req,res)=>{
        const Product =await productModel.find({category:"Phones"})
        res.render("user/userProducts",{Product})
    },
    shoesGet:async(req,res)=>{
        const Product =await productModel.find({category:"shoe"})
        res.render("user/userProducts",{Product})
    }

}

