const mongoose =require("mongoose")

const schema ={
    name:{
        type:String,
        required:[true,"name is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"]
    },
    compmanyName:{
        type:String,
        // required:[true,"company name  is required"]
    },
    gstCode:{
        type:String,
        required:[true,"GST code is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    }
    
}

const adminDataSchema = new mongoose.Schema(schema)
const adminSignupModal =new mongoose.model("adminSignupData",adminDataSchema)


module.exports=adminSignupModal