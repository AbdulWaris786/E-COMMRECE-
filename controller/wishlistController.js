const wishlistModel =require("../models/wishlistSchema")


module.exports={
    wishlistGet:async(req,res)=>{
        const userId = req.session.email
        if(!userId){
            console.log("arrum illa machuooo");
            res.redirect("/login")
        }else{
            const wishlistProduct = await wishlistModel.find({userId})
            res.render("user/wishlist",{wishlistProduct})
        }
    },
    wishlistPost:async(req,res)=>{
            console.log(req.body,'cn');
            const {userId,productId} =req.body
            if(!userId || !productId){
                console.log("1");
                return res.status(400).json({ error: "productId and userId are required" });
            }
            try {
                console.log("2");
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
                console.log(lengthItems);
                return res.status(200).json({ message: "Item added to wishlist successfully"});
            } catch (error) {
                if (error.name === 'ValidationError') {
                    return res.status(400).json({ error: error.message });
                }
                return res.status(500).json({ error: "Internal server error" });
            }
    }
}