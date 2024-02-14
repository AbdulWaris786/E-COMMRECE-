const express = require("express")
const router = express.Router()
const {setUploadType,upload} =require("../middleware/multer")
const authController =require("../controller/authController")
const categoryController =require("../controller/categoryController")
const adminController =require("../controller/adminController")
const {
    
    aHomePage,
    aUsersGet,
    aProductGet,aProductPost,
    aCouponGet,aCouponPost,
    aOrderGet,aOrderPost,
    aBannerGet,aBannerPost,
    addProductGet,addProductPost,
    addCouponGet,addCouponPost,
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

router.delete("/admin/categorydlt/:id",categoryController.aCategoryDltGet)

//admin conroller 
router.get("/admin/banner",adminController.aBannerGet)
router.get("/admin/addBanner",adminController.addBannerGet)
// router.post("/admin/banner",adminController.aBannerPost)
router.post("/admin/addBanner",setUploadType("banner"),upload.single("bannerImage"),adminController.addBannerPost)

router.get("/admin/home",aHomePage) 
.get("/admin/users",aUsersGet)
.get("/admin/user/:id",aUserDltGet)
.get("/admin/product",aProductGet)
.get("/admin/coupons",aCouponGet)
.get("/admin/orders",aOrderGet)

.get("/admin/addProduct",addProductGet)
.get("/admin/addCoupon",addCouponGet)

.get("/admin/userAddress/:id",aUserDetailsGet)





module.exports=router