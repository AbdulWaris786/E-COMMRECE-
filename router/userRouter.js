const express = require("express")
const router = express.Router()
const authController =require("../controller/authController")
const otpVerification =require("../utility/otpVerification")
const forgotPassword =require("../utility/forgotPassword")
const productController=require("../controller/productController")
const userController = require("../controller/userController")
const addToCartController =require("../controller/addToCartController")
const wishlistController = require("../controller/wishlistController")
const checkoutController =require("../controller/checkoutController")
//user login
router.get("/login",authController.loginGet)
router.post("/login",authController.loginPost)

//user signup
router.get("/signup",authController.signupGet)
router.post("/signup",authController.signupPost)

//user otp verifivation
router.get("/otp",otpVerification.otpGet)
router.post("/otp",otpVerification.otpPost)
router.get("/otpRecive",otpVerification.otpReciveGet)
router.post("/otpRecive",otpVerification.otpRecivePost)

//user forgot password
router.get("/forgotPassword",forgotPassword.forgotPasswordGet)
router.post("/forgotPassword",forgotPassword.forgotPasswordPost)
router.get("/newPassword",forgotPassword.newPasswordGet)
router.post("/newPassword",forgotPassword.newPasswordPost)
router.get("/forgotOtp",forgotPassword.forgotOtpGet)
router.post("/forgotOtp",forgotPassword.forgotOtpPost)

// user profile details
router.get("/addressAdd",userController.addressAddGet)
router.post("/addressAdd/:id",userController.addressAddPost)
router.get("/",userController.homePageGet)

// user product controller 
router.get("/womens",productController.womenProductGet)
router.get("/mens",productController.menProductGet)
router.get("/phones",productController.phonesGet)
router.get("/shoes",productController.shoesGet)
router.get("/productDetails/:id",productController.productGet)

//ADD TO CART controller
router.get("/addToCart",addToCartController.addToCartGet)
router.post("/addToCart/add",addToCartController.addToCartPost)
router.get("/countCart",addToCartController.countCartGet)
router.delete("/addToCartDlt/:id",addToCartController.cartDelete)
router.post("/updateCart",addToCartController.updateCartPost)

// wishlist controller
router.get("/wishlist",wishlistController.wishlistGet)
router.post("/wishlist/add",wishlistController.wishlistPost)
router.delete("/wishlistDlt/:id",wishlistController.removeWishlist)
router.get("/countWishlist",wishlistController.countWishlistGet)

//checkout controller
router.get("/checkout",checkoutController.checkoutGet)
router.post("/checkout/:id",checkoutController.checkoutPost)
router.get("/cashOnDelivery",checkoutController.cashOnDeliveryGet)
router.post("/withCoupon",checkoutController.cashOnDeliveryAPost)
router.post("/withoutCoupon",checkoutController.cashOnDeliveryBPost)
router.get("/orderDetails",checkoutController.orderDetailsGet) 
router.get("/onlinePayment",checkoutController.onlinePaymentGet)

//searchbar 
router.get("/search",userController.searchBar)




module.exports=router