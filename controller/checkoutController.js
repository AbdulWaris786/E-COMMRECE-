const addressModel =require("../models/userAddressSchema");
const userModel =require("../models/userSignupSchema");
const cartModel = require("../models/addToCartSchema")
const couponModel = require("../models/addCouponSchema")
const razorpay = require('razorpay')
const productModel =require("../models/addProductSchema")
const orderProduct = require("../models/orderProductsSchema")
var instance = new razorpay({ key_id:process.env.KEYID, key_secret:process.env.KEYSECRET})

module.exports={
    checkoutGet:async(req,res)=>{
        const userId =req.session.email

        try {
            if(!userId){
                res.redirect("/login")
            }else{
                const address =await addressModel.findOne({userId})
                const obj = address.obj
                const cart = await cartModel.findOne({userId}).populate('items.productId')
                let amount =0
                const Pamount = cart.items.forEach((data)=>{
                    const price = data.productId.newPrice
                    const quantity =data.quantity
                    amount += price * quantity
                })
                
                res.render("user/checkout",{address,cart,amount,obj})
            }
        } catch (error) {
            console.log(error);
        }
    },
    checkoutPost:async(req,res)=>{
        const paymentMethod = req.body.payment
        const amount = req.params.id
        req.session.payment =paymentMethod
        if(paymentMethod =="cash"){
            req.session.amount = amount
            req.session.address = req.body.selectedAddress
            if(amount<20000 && amount>10000){
                const coupon = await couponModel.find({purchaceAbove:10000})
                const data = {
                    url: "/cashOnDelivery",
                    coupon: coupon
                };
                res.status(200).json(data);
            }else if(amount<30000 && amount>20000){
                const coupon = await couponModel.find({purchaceAbove:20000})
                const data = {
                    url: "/cashOnDelivery",
                    coupon: coupon
                };
                res.status(200).json(data);
                
            }else if(amount<40000 && amount>30000){
                const coupon = await couponModel.find({purchaceAbove:30000})
                const data = {
                    url: "/cashOnDelivery",
                    coupon: coupon
                };
                res.status(200).json(data);
            }else if(amount>50000){
                const coupon = await couponModel.find({purchaceAbove:50000})
                const data = {
                    url: "/cashOnDelivery",
                    coupon: coupon
                };
                res.status(200).json(data);
            }



        }else if(paymentMethod =='RazorPay'){
            if(amount<10000){
                const pissa = amount*100
                console.log(pissa);
                const key =process.env.KEYID
                const orderOption ={
                amount:pissa,
                currency :'INR',
                receipt:'receipt_order_1',
                payment_capture:1
                }
                const order =await instance.orders.create(orderOption)
                res.status(200).json(order,key)
            }else{

            }
        }else{

        }
    },
    cashOnDeliveryGet:async(req,res)=>{ 
        const id = req.query.id
        const coupon =await couponModel.findById(id)
        const details = req.session.address
        const amount =req.session.amount
        res.render("user/cashOnDelivery",{amount,coupon,details})
    },
    cashOnDeliveryAPost:async(req,res)=>{
        const userId = req.session.email
        const details = req.session.address
        const totalAmount =req.session.amount
        const cart = await cartModel.findOne({userId})
        const cartProduct = cart.items
        const test = cart.items.productId
        console.log(test,cartProduct);
        const paymentMethod =req.session.payment
        const amount = parseInt(totalAmount)
        const discountAmount=amount
        let price = 0
        if (totalAmount<20000 &&totalAmount>10000) {
            const coupon = await couponModel.find({purchaceAbove:10000})
            const discountPrice =discountAmount*(discount/100)
            const priceDiscount =parseFloat(discountPrice)
            price =priceDiscount
        } else if(totalAmount<30000 &&totalAmount>20000){
            const coupon = await couponModel.find({purchaceAbove:20000})
            const discountPrice =discountAmount*(discount/100)
            const priceDiscount =parseFloat(discountPrice)
            price =priceDiscount
        }else if(totalAmount<40000 &&totalAmount>30000){
            const coupon = await couponModel.find({purchaceAbove:30000})
            const discount = coupon[0].discount
            const discountPrice =discountAmount*(discount/100)
            const priceDiscount =parseFloat(discountPrice)
            price =priceDiscount
        }else if(totalAmount>50000){
            const coupon = await couponModel.find({purchaceAbove:50000})
            const discount = coupon[0].discount
            const discountPrice =discountAmount*(discount/100)
            const priceDiscount =parseFloat(discountPrice)
            price =priceDiscount
        }
        try {
            const newOrder = orderProduct({
                userId:userId,
                products:cartProduct.map(item=>({product: item.productId, quantity: item.quantity })),
                fullName:details.fullName,
                address:details.address,
                pinCode:details.pinCode,
                phoneNumber:details.phoneNumber,
                paymentMethod:paymentMethod,
                status:'pending',
                createdAt:Date(),
                totalamount:price,
                coupon:"with Coupon"
            })
            await newOrder.save();
            res.status(200).json({ message: 'Order saved successfully', order: newOrder });
        } catch (error) {
            console.error('Error saving order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }

    },
    cashOnDeliveryBPost:async(req,res)=>{
        const userId = req.session.email
        const details = req.session.address
        const totalAmount =req.session.amount
        const cart = await cartModel.findOne({userId})
        const cartProduct = cart.items
        const paymentMethod =req.session.payment
        try {
            const newOrder = orderProduct({
                userId:userId,
                products:cartProduct.map(item=>({product: item.productId, quantity: item.quantity })),
                fullName:details.fullName,
                address:details.address,
                pinCode:details.pinCode,
                phoneNumber:details.phoneNumber,
                paymentMethod:paymentMethod,
                status:'pending',
                createdAt:Date(),
                totalamount:totalAmount,
                coupon:"withOut Coupon"
            })
            await newOrder.save();
            await cartModel.findOneAndDelete(
                {
                    userId:req.session.email
                }
            )
            res.status(200).json({ message: 'Order saved successfully', order: newOrder });
        } catch (error) {
            console.error('Error saving order:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}