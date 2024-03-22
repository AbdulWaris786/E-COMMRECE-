const signupData =require("../models/userSignupSchema")
const profileModel =require("../models/userAddressSchema")
const flash =require("connect-flash")
const { default: mongoose } = require("mongoose")
const signupModal = require("../models/userSignupSchema")
const productModel = require("../models/addProductSchema")

const emailPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;

module.exports={
    homePageGet:async(req,res)=>{
        const productMedium = await productModel.find({colour:"Blue"})
        const productPhone = await productModel.find({subCategory:"i phones 15 "})
        const weeklyProduct = await productModel.find({subCategory:"new balance"})
        const flashProduct = await productModel.find({subCategory:"track pants"})
        res.render("user/home",{productMedium,productPhone,weeklyProduct,flashProduct})
    },
    addressAddGet: async (req, res) => {
        try {
            const email = req.session.email;
            const userData = await signupData.findOne({ email });
            if (!userData) {
                res.redirect("/login")
            }else{
                const obj =userData._id
                res.render("user/userAddressAdd",{obj}); 
            }
            
        } catch (error) {
            console.error("Error:", error);
            res.status(500).send("Internal Server Error");
        }
    },
    addressAddPost:async(req,res)=>{
        const users=req.body
        const userId =req.session.email
        const obj = req.params.id
        const {firstName,lastName,phone,streetAddress,country,state,city,pinCode}=users
        if(!userId){
            return res.status(404).send("User not found");
        }else{
            try {
                const userExist =await profileModel.findOne({userId})
                if(userExist){
                    userExist.addresses.push({
                        firstName,lastName,
                        phone,streetAddress,
                        country,state,
                        city,pinCode
                    })
                    await userExist.save();
                    
                }else{
                    const newUser =new profileModel({
                        userId,
                        addresses:[{
                            firstName,lastName,
                            phone,streetAddress,
                            country,state,
                            city,pinCode
                        }],
                        obj

                    })
                    await newUser.save()
                }
                res.redirect('/')
            } catch (error) {
                console.log(error);
            }

        }

        
    },
    searchBar: async (req, res) => {
        const query = req.query.q;
        const userId = req.session.email;
    
        // Pagination parameters
        const page = parseInt(req.query.page) || 1; // Current page, default to 1 if not provided
        const limit = parseInt(req.query.limit) || 10; // Number of items per page, default to 10 if not provided
    
        try {
            if (query) {
                const totalProducts = await productModel.countDocuments({
                    $or: [
                        { productName: { $regex: query, $options: 'i' } },
                        { subCategory: { $regex: query, $options: 'i' } },
                        { category: { $regex: query, $options: 'i' } }
                    ]
                });
    
                const totalPages = Math.ceil(totalProducts / limit);
                const offset = (page - 1) * limit;
    
                const products = await productModel.find({
                        $or: [
                            { productName: { $regex: query, $options: 'i' } },
                            { subCategory: { $regex: query, $options: 'i' } },
                            { category: { $regex: query, $options: 'i' } }
                        ]
                    })
                    .limit(limit)
                    .skip(offset);
    
                res.render("user/products", {
                    products,
                    userId,
                    currentPage: page,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                    query
                });
            }
        } catch (error) {
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    logoutGet:(req,res)=>{
        req.session.destroy(()=>{
            res.redirect("/login")
           })
    }
    
}