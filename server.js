require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req,res)=>{
  if(!process.env.APP_STATUS){
    return res.status(500).send("Service Down: ENV missing");
  }
  res.send("Service Running");
});

app.get("/logs",(req,res)=>{
  res.json({error:"APP_STATUS env variable not set"});
});

app.post("/fix", async (req,res)=>{
  try {
    const r = await fetch(
      "https://api.github.com/repos/tejastundalwar/Devops_Puzzle_BrokenService/dispatches",
      {
        method: "POST",
        headers: {
          "Accept": "application/vnd.github+json",
          "Authorization": `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ event_type: "fix" })
      }
    );

    if (!r.ok) {
      const text = await r.text();
      return res.status(500).json({ error: text });
    }

    res.json({ message: "Redeploy triggered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000,()=>console.log("Running"));

console.log("Token loaded:", !!process.env.GITHUB_TOKEN);


//curl -X POST http://localhost:3000/fix   --- Used to trigger the Github Actions