const mongoose =require("mongoose")


const categorySchema={
    categoryImage:{
        type:String
    },
    categoryName:{
        type:String
    },
    subCategory:{
        type:String
    }
}

const categoryDataSchema =new mongoose.Schema(categorySchema)
const categoryModel =new mongoose.model("categoryDetails",categoryDataSchema)


module.exports=categoryModel