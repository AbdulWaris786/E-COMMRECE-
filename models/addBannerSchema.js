const mongoose =require("mongoose")

const bannerSchema ={
    bannerImage:{
        type:String
    },
    bannerProduct:{
        type:String
    },
    bannerHeading:{
        type:String
    },
    specialPrice:{
        type:Number
    },
    startingDate:{
        type:String
    },
    endingDate:{
        type:String
    }
}

const bannerDataSchema = new mongoose.Schema(bannerSchema)
const bannerModel =new mongoose.model("bannerdetails",bannerDataSchema)

module.exports=bannerModel