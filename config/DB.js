const mongoose =require("mongoose")

const  connectDB =async ()=>{
    try {
        const connection  =await mongoose.connect(process.env.URI)
        console.log(`mongoDB connected:${connection.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports=connectDB