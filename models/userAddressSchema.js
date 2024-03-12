const mongoose =require("mongoose")

const schema ={
    userId:{
        type: String,
        required: true,
        ref:"usersignupdatas"
    },
    addresses:[{
        firstName:String,
        lastName:String,
        phone:Number,
        streetAddress:String,
        country:String,
        state:String,
        city:String,
        pinCode:Number,
    }],
    obj:{
        type:mongoose.Types.ObjectId
    }
    

}
const dataSchema=new mongoose.Schema(schema)
const addressModel =new mongoose.model("userAddressdetails",dataSchema)

module.exports=addressModel
