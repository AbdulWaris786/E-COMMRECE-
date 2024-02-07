const express = require("express")
const router = express.Router()
const {setUploadType,upload} =require("../middleware/multer")



const {
    aLoginGet,aLoginPost,
    aSignupGet,aSignupPost,
    aHomePage,
    aUsersGet,
    aProductGet,aProductPost,
    aCategoryGet,aCategoryPost,
    aCouponGet,aCouponPost,
    aOrderGet,aOrderPost,
    aBannerGet,aBannerPost,
    addProductGet,addProductPost,
    addCategoryGet,addCategoryPost,
    addCouponGet,addCouponPost,
    addBannerGet,addBannerPost,
    aUserDltGet,aCategoryDltGet,
    aCategoryEditGet,aCategoryEditPost,
    aUserDetailsGet

}= require("../controller/adminController")

router.get("/admin/login",aLoginGet)
.get("/admin/signup",aSignupGet)
.get("/admin/home",aHomePage) 
.get("/admin/users",aUsersGet)
.get("/admin/user/:id",aUserDltGet)
.get("/admin/product",aProductGet)
.get("/admin/category",aCategoryGet)
.get("/admin/categorydlt/:id",aCategoryDltGet)
.get("/admin/coupons",aCouponGet)
.get("/admin/orders",aOrderGet)
.get("/admin/banner",aBannerGet)
.get("/admin/addProduct",addProductGet)
.get("/admin/addCategory",addCategoryGet)
.get("/admin/addCoupon",addCouponGet)
.get("/admin/addBanner",addBannerGet)
.get("/admin/editCategory/:id",aCategoryEditGet)
.get("/admin/userAddress/:id",aUserDetailsGet)


.post("/admin/login",aLoginPost)
.post("/admin/signup",aSignupPost)
.post("/admin/product",aProductPost)
.post("/admin/category",setUploadType("category"),upload.single("categoryImage"),aCategoryPost) 
.post("/admin/coupons",aCouponPost)
.post("/admin/orders",aOrderPost)
.post("/admin/banner",aBannerPost)
.post("/admin/addProduct",addProductPost)
.post("/admin/addCateory",addCategoryPost)
.post("/admin/addCoupon",addCouponPost)
.post("/admin/addBanner",addBannerPost)
.post("/admin/editcategory/:id",setUploadType("category"),upload.single("categoryImage"),aCategoryEditPost)


module.exports=router