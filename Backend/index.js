import express from "express"
import cookiePraser from "cookie-parser"

const app=express();

const port=process.env.PORT || 3000;


app.get('/',(req,res)=>{
    console.log("API working")
})


app.use(cookiePraser)


app.listen(port,()=>{
    console.log("server listening")
})