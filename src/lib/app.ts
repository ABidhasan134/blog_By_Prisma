import express from 'express'

 const app=express();
 app.get('/',(req,res)=>{
    console.log("Hello world")
    res.send("hello world")
 })
 export default app;