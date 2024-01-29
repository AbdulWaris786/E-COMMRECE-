const express = require("express")
const router = express.Router()

const {
    adminPage
}= require("../controller/adminController")

router.get("/admin",adminPage)



module.exports=router