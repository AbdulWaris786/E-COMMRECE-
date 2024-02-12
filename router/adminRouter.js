const express = require("express")
const router = express.Router()
const {setUploadType,upload} =require("../middleware/multer")
const authController =require("../controller/authController")
const categoryController =require("../controller/categoryController")

const {
    
    aHomePage,
    aUsersGet,
    aProductGet,aProductPost,
    aCouponGet,aCouponPost,
    aOrderGet,aOrderPost,
    aBannerGet,aBannerPost,
    addProductGet,addProductPost,
    addCouponGet,addCouponPost,
    addBannerGet,addBannerPost,
    aUserDltGet,
    aUserDetailsGet

}= require("../controller/adminController")

//authantication controller
router.get("/admin/login",authController.aLoginGet)
router.post("/admin/login",authController.aLoginPost)

router.get("/admin/signup",authController.aSignupGet)
router.post("/admin/signup",authController.aSignupPost)

//category controller
router.get("/admin/category",categoryController.aCategoryGet)
router.post("/admin/category",setUploadType("category"),upload.single("categoryImage"),categoryController.aCategoryPost) 

router.get("/admin/addCategory",categoryController.addCategoryGet)
router.post("/admin/addCateory",categoryController.addCategoryPost)

router.get("/admin/editCategory/:id",categoryController.aCategoryEditGet)
router.post("/admin/editcategory/:id",setUploadType("category"),upload.single("categoryImage"),categoryController.aCategoryEditPost)

router.get("/admin/categorydlt/:id",categoryController.aCategoryDltGet)



router.get("/admin/home",aHomePage) 
.get("/admin/users",aUsersGet)
.get("/admin/user/:id",aUserDltGet)
.get("/admin/product",aProductGet)
.get("/admin/coupons",aCouponGet)
.get("/admin/orders",aOrderGet)
.get("/admin/banner",aBannerGet)
.get("/admin/addProduct",addProductGet)
.get("/admin/addCoupon",addCouponGet)
.get("/admin/addBanner",addBannerGet)
.get("/admin/userAddress/:id",aUserDetailsGet)



.post("/admin/product",aProductPost)
.post("/admin/coupons",aCouponPost)
.post("/admin/orders",aOrderPost)
.post("/admin/banner",aBannerPost)
.post("/admin/addProduct",addProductPost)
.post("/admin/addCoupon",addCouponPost)
.post("/admin/addBanner",addBannerPost)



module.exports=router