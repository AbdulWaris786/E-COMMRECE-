const path=require("path")
const fs =require("fs");
const cartModel =require("../models/addToCartSchema")
const productModel = require("../models/addProductSchema")


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
            let productImages = [];
                if (req.files) {
                    req.files.forEach(file => {
                        productImages.push(file.filename);
                    });
                }
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
    womenProductGet: async (req, res) => {
        const userId = req.session.email;
    
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Number of items per page, default to 10 if not provided
    
        try {
            const totalProducts = await productModel.countDocuments({ category: "women" });
            const totalPages = Math.ceil(totalProducts / limit);
            const offset = (page - 1) * limit;
    
            const product = await productModel.find({ category: "women" })
                .limit(limit) 
                .skip(offset);
    
            res.render("user/userProducts", {
                product,
                userId,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    menProductGet: async (req, res) => {
        const userId = req.session.email;
    
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Number of items per page, default to 10 if not provided
    
        try {
            const totalProducts = await productModel.countDocuments({ category: "mens" });
            const totalPages = Math.ceil(totalProducts / limit);
            const offset = (page - 1) * limit;
    
            const product = await productModel.find({ category: "mens"  })
                .limit(limit) 
                .skip(offset);
    
            res.render("user/userProducts", {
                product,
                userId,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    phonesGet: async (req, res) => {
        const userId = req.session.email;
    
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Number of items per page, default to 10 if not provided
    
        try {
            const totalProducts = await productModel.countDocuments({ category: "Phones" });
            const totalPages = Math.ceil(totalProducts / limit);
            const offset = (page - 1) * limit;
    
            const product = await productModel.find({category: "Phones" })
                .limit(limit) 
                .skip(offset);
    
            res.render("user/userProducts", {
                product,
                userId,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    shoesGet: async (req, res) => {
        const userId = req.session.email;
    
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Number of items per page, default to 10 if not provided
    
        try {
            const totalProducts = await productModel.countDocuments({ category: "shoe" });
            const totalPages = Math.ceil(totalProducts / limit);
            const offset = (page - 1) * limit;
    
            const product = await productModel.find({ category: "shoe" })
                .limit(limit) 
                .skip(offset);
    
            res.render("user/userProducts", {
                product,
                userId,
                currentPage: page,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1
            });
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    productGet:async(req,res)=>{
        const userId =req.session.email
        const id= req.params.id
        if(!userId){
            const product = await productModel.findById(id)
            res.render("user/productDetails",{product})
        }else{
            const product =await  productModel.findById(id)
            
            const cartProduct =await cartModel.findOne({userId})
            const cart =cartProduct.items.forEach((data)=>{
                console.log(data,"ithaa");
            })

            console.log(product);

            res.render("user/productDetails",{product})
        }

    }

}

