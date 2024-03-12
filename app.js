const express = require("express")
const app = express()
const mongoose =require("mongoose")
const path =require("path")
const flash = require("connect-flash")
const session =require("express-session")
const bodyParser =require("body-parser")
require('dotenv').config()
const twilio =require("twilio")
const port =process.env.PORT||3000

const userRouter =require("./router/userRouter")
const adminRouter =require("./router/adminRouter")
const DBconnection =require("./config/DB")
app.use(session({
    secret: 'your-secret-key', // Change this to a secret key for session encryption
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(flash())
// app.set("views", path.join(__dirname, "views"));
app.use("/",userRouter)
app.use("/",adminRouter)



DBconnection().then(()=>{
  app.listen(port,()=>console.log(`server is running now......${port}`))
}).catch(()=>{
  console.log("error connecting database");
})





// mongoose                             //database will connecting
//   .connect("mongodb://localhost:27017/mainProject")
//   .then(()=>console.log("database connected"))
//   .catch((err)=>console.log("connection failed",err))