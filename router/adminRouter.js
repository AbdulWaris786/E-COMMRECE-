const express = require("express")
const router = express.Router()
const {setUploadType,upload} =require("../middleware/multer")



const {
    aLoginGet,aLoginPost,
    aSignupGet,aSignupPost,
    aHomePage,
    aUsersGet,aUserDltGet,
    aProductGet,aProductPost,
    aCategoryGet,aCategoryPost,
    aCouponGet,aCouponPost,
    aOrderGet,aOrderPost,
    aBannerGet,aBannerPost,
    addProductGet,addProductPost,
    addCategoryGet,addCategoryPost,
    addCouponGet,addCouponPost,
    addBannerGet,addBannerPost

}= require("../controller/adminController")

router.get("/admin/login",aLoginGet)
.get("/admin/signup",aSignupGet)
.get("/admin/home",aHomePage) 
.get("/admin/users",aUsersGet)
.get("/admin/user/:id",aUserDltGet)
.get("/admin/product",aProductGet)
.get("/admin/category",aCategoryGet)
.get("/admin/coupons",aCouponGet)
.get("/admin/orders",aOrderGet)
.get("/admin/banner",aBannerGet)
.get("/admin/addProduct",addProductGet)
.get("/admin/addCategory",addCategoryGet)
.get("/admin/addCoupon",addCouponGet)
.get("/admin/addBanner",addBannerGet)


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



module.exports=router