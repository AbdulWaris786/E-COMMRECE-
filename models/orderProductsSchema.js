const mongoose =require("mongoose")

const orderSchema ={
    userId:{
        type:String,
        required:true
    },
    products:[{
        product:{
            type:mongoose.Types.ObjectId,
            ref:'produtdetails',
            required:true
        },
        quantity:{
            type:Number,
            required:true
        },
        
    }],
    fullName: {
        type: String,
        required: true
    },
    address:{
        type:String,
        required:true
    },
    pinCode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'RazorPay'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending',  'shipped', 'delivered','cancelled'],
        default: 'pending'
    },
    createdAt: {
        type:String,
        default: Date.now
    },
    totalamount:{
        type:Number,
        required:true
    },
    coupon:{
        type:String
    }
}
const orderDataSchema = new mongoose.Schema(orderSchema)
const orderModel =new mongoose.model("OrderDetails",orderDataSchema)

module.exports=orderModel