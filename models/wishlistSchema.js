const mongoose =require("mongoose")

const wishlistItemsSchema = new mongoose.Schema({
    userId:{
        type:String,
        requried:true
    },
    items:[{
        productId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'produtdetails',
            requried:true
        }
    }]
});
const wishlistModel =mongoose.model("wishlist",wishlistItemsSchema)
module.exports=wishlistModel;