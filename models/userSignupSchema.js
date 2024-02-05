const mongoose =require("mongoose")

const schema ={
    name:{
        type:String,
        required:[true,"name is required"]
    },
    phone:{
        type:Number,
        required:[true,"number is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"]
    },
    password:{
        type:String,
        required:[true,"password is required"]
    },
    verify:{
        type:String
    },
    Verification:{
        type:String,
        
    }
}

const dataSchema = new mongoose.Schema(schema)
const signupModal =new mongoose.model("userSignupData",dataSchema)

module.exports=signupModal