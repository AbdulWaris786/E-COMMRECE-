const express = require("express")
const router = express.Router()
const {setUploadType,upload} =require("../middleware/multer")
const authController =require("../controller/authController")
const categoryController =require("../controller/categoryController")
const adminController =require("../controller/adminController")
const productController =require("../controller/productController")
const {
    
    aHomePage,
    aOrderGet,

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

//admin controller==banner
router.get("/admin/banner",adminController.aBannerGet)
router.get("/admin/addBanner",adminController.addBannerGet)
router.post("/admin/addBanner",setUploadType("banner"),upload.single("bannerImage"),adminController.addBannerPost)
router.delete("/admin/bannerDlt/:id",adminController.bannerDlt)

//admin controller == coupon
router.get("/admin/coupons",adminController.couponGet)
router.get("/admin/addCoupon",adminController.addCouponGet)
router.post("/admin/addCoupon",adminController.addCouponPost)
router.delete("/admin/couponDlt/:id",adminController.couponDlt)

//admin controller ==user 
router.get("/admin/users",adminController.UsersGet)
router.patch("/admin/user/:id",adminController.blockGet)
router.get("/admin/userAddress/:id",adminController.UserDetailsGet)
router.get("/admin/blockedUsers",adminController.blockedUser)
router.patch("/admin/blockedUsers/:id",adminController.unblockUser)
router.delete("/admin/userDelete/:id",adminController.userdlt)

//product controller
router.get("/admin/product",productController.ProductGet)
router.get("/admin/addProduct",productController.addProductGet)
router.post("/admin/addProduct",setUploadType("products"),upload.array("productImages",10),productController.addproductPost)
router.delete("/admin/productDlt/:id",productController.productDelete)
router.get("/admin/editProduct/:id",productController.editProductGet)
router.post("/admin/editProduct/:id",setUploadType("products"),upload.array("productImages",10),productController.editProductPatch)



router.get("/admin/home",aHomePage) 



.get("/admin/orders",aOrderGet)







module.exports=router