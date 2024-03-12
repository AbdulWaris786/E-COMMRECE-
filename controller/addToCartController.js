const { default: mongoose, Types } = require("mongoose");
const categoryModel = require("../models/addCategorySchema");
const productModel = require("../models/addProductSchema");
const CartModel =require("../models/addToCartSchema")



module.exports={
    addToCartGet:async(req,res)=>{
        const userId = req.session.email
        try {
            if(!userId){
                res.redirect("/login")
            }else{

                const cartProduct =await CartModel.find({userId}).populate('items.productId')
                // console.log(cartProduct,'main');
                let amount =0
                const Pamount = cartProduct[0].items.forEach((data)=>{
                    // console.log(data,'main1');
                    const price = data.productId.newPrice
                    const quantity =data.quantity
                    amount += price * quantity
                })
                
                res.render("user/addToCart",{cartProduct,amount})
            }
        } catch (error) {
            console.log(error);
        }
    },
    addToCartPost:async(req,res)=>{
        const {productId,quantity}=req.body
        const userId=req.session.email
        if(!productId || !quantity || !userId){
            return res.status(400).json({ error: "productId, quantity, and userId are required" });
        }
        try {
            const cart = await CartModel.findOne({ userId });
            
            if (cart) {
                // If cart exists, update it
                cart.items.push({ productId, quantity });
                await cart.save();
            } else {
                // If cart doesn't exist, create a new one
                const newCart = new CartModel({
                    userId,
                    items: [{ productId, quantity }]
                });
                await newCart.save();
            } 
            const lengthItems = cart.items.length
            return res.status(200).json({ message: "Item added to cart successfully"});
        } catch (error) {
            console.error("Error adding item to cart:", error);
            if (error.name === 'ValidationError') {
                return res.status(400).json({ error: error.message });
            }
            return res.status(500).json({ error: "Internal server error" });
        }
    },
    countCartGet:async(req,res)=>{
        try {
            const userId = req.session.email;
            const cart = await CartModel.findOne({ userId });
            const itemsLength = cart ? cart.items.length : 0;
            
            // res.render('home', { itemsLength });
            res.status(200).json({message:"count will reloaded",itemsLength,cart })
        } catch (error) {
            console.error("Error rendering cart page:", error);
            res.status(500).send("Internal server error");
        }
    },
    cartDelete:async(req,res)=>{
        try {
            const _id =req.params.id 
            const userId = req.session.email
            const id =new mongoose.Types.ObjectId(_id)
            const data =await CartModel.find({userId:userId})
            const item =data
            const removeCart =await CartModel.updateOne(
                {userId},
                {$pull:{items:{_id:id}}}
            );
            // console.log(_id,"userid",userId,"row",id,"datas",data,"items",item); 

            if(removeCart){
                console.log("wew");
                return res.status(200).json({ message: 'Cart  deleted successfully' });
            }else{
                console.log("gs");
                res.status(404).json({ message: 'Cart not found or already deleted' });
            }
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },
    updateCartPost:async (req,res)=>{
        try {
            const userId =req.session.email
            const { productId , qty } = req.body;

            const productIdObj = new Types.ObjectId(productId)
            
            const updateQuantity = await CartModel.updateOne(
                {userId:userId , 'items.productId':productIdObj},
                {'items.$.quantity':qty}
            )
            console.log("Cart quantity updated successfully.");
            res.status(200).json({success:true,message:"quantity updated"})
        } catch (error) {
            console.log("cart quantity upatate",error);
        }
    }
}   