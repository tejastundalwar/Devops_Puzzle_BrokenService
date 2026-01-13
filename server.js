const express = require("express");
const app = express();

app.get("/", (req,res)=>{
  if(!process.env.APP_STATUS){
    return res.status(500).send("Service Down: ENV missing");
  }
  res.send("Service Running");
});

app.get("/logs",(req,res)=>{
  res.json({error:"APP_STATUS env variable not set"});
});

app.listen(3000,()=>console.log("Running"));
