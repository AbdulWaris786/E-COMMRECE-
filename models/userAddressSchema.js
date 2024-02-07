const mongoose =require("mongoose")

const schema ={
    firstName:{
        type:String,
        required:[true,"name is required"]
    },
    lastName:{
        type:String,
        required:[true,"name is required"]
    },
    phone:{
        type:Number,
        required:[true,"number is required"]
    },
    streetAddress:{
        type:String,
        requrequired:[true,"number is required"]
    },
    country:{
        type:String,
        requrequired:[true,"number is required"]
    },
    state:{
        type:String,
        requrequired:[true,"number is required"]
    },
    city:{
        type:String,
        requrequired:[true,"number is required"]
    },
    pinCode:{
        type:String,
        requrequired:[true,"number is required"]
    },
    obj:{
        type:mongoose.Types.ObjectId
    }

}
const dataSchema=new mongoose.Schema(schema)
const addressModel =new mongoose.model("userAddressdetails",dataSchema)

module.exports=addressModel
