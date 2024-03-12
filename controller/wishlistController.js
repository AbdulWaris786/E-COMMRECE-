const { default: mongoose } = require("mongoose");
const wishlistModel =require("../models/wishlistSchema")


module.exports={
    wishlistGet:async(req,res)=>{
        const userId = req.session.email
        if(!userId){
            console.log("arrum illa machuooo");
            res.redirect("/login")
        }else{
            const wishlistProduct = await wishlistModel.find({userId}).populate('items.productId')
            res.render("user/wishlist",{wishlistProduct})
        }
    },
    wishlistPost:async(req,res)=>{
            const {userId,productId} =req.body
            if(!userId || !productId){
                return res.status(400).json({ error: "productId and userId are required" });
            }
            try {
                const wishlist = await wishlistModel.findOne({userId})
                if(wishlist){
                    wishlist.items.push({productId})
                    await wishlist.save()
                }else{
                    const newWishlist =new wishlistModel({
                        userId,
                        items:[{productId}]
                    })
                    await newWishlist.save()
                }
                const lengthItems =wishlist.items.length
                return res.status(200).json({ message: "Item added to wishlist successfully"});
            } catch (error) {
                if (error.name === 'ValidationError') {
                    return res.status(400).json({ error: error.message });
                }
                return res.status(500).json({ error: "Internal server error" });
            }
    },
    removeWishlist:async(req,res)=>{
        try {
            const _id=req.params.id
            const userId = req.session.email
            const id =new mongoose.Types.ObjectId(_id)
            const data =await wishlistModel.find({userId:userId})
            const removeWishlist =await wishlistModel.updateOne(
                {userId},
                {$pull:{items:{_id:id}}}
            )
            if(removeWishlist){
                console.log("poyi");
                return res.status(200).json({message:"wishlist deleted succesfully"})
            }else{
                console.log("povvunnilla");
                res.status1(404).json({message:"wishlist not found or already delete"})
            }
        } catch (error) {
            console.error(error)
            res.status(500).json({message:"internal server error"})
        }
    },
    countWishlistGet:async(req,res)=>{
        try {
            const userId =req.session.email;
            const wishlist = await wishlistModel.findOne({userId});
            const itemslength = wishlist? wishlist.items.length :0;
            res.status(200).json({message:"count will reloaded",itemslength})
        } catch (error) {
            console.error("error rendering wishlist page:",error);
            res.status(500).json({message:"internal server error"})
        }
    }
}