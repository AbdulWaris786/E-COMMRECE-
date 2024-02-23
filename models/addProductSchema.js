const mongoose =require("mongoose")


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
const productModel =new mongoose.model("produtdetails",productDataScema)

module.exports=productModel