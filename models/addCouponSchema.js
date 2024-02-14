const mongoose =require("mongoose")

const couponSchema={
    couponName:{
        type:String
    },
    couponCode:{
        type:Number
    },
    discount:{
        type:Number
    },
    purchaceAbove:{
        type:Number
    },
    startingDate:{
        type:String
    },
    endingDate:{
        type:String
    }
}
const couponDataSchema = new mongoose.Schema(couponSchema)
const couponModel =new mongoose.model("couponDetails",couponDataSchema)

module.exports=couponModel