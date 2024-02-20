const mongoose =require("mongoose")
const { MessagingConfigurationPage } = require("twilio/lib/rest/verify/v2/service/messagingConfiguration")

const productSchema ={
    productName:{
        type:String
    },
    newPrice:{
        type:Number
    },
    oldPrice:{
        type:Number
    },
    category:{
        type:String
    },
    subCategory:{
        type:String
    },
    colour:{
        type:String
    },
    size:{
        type:String
    },
    quantity:{
        type:Number
    },
    description:{
        type:String
    },
    productImages:{
        type : Array
    }

}
const productDataScema =new mongoose.Schema(productSchema)
const productModel =new mongoose.model("produtDetails",productDataScema)

module.exports=productModel