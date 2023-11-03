const express = require("express");
require("dotenv").config();

const app = express();
const PORT = 9560;

//file imports
const db = require("./config/db"); 
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const followRoutes = require("./routes/follow");
const { cleanUpBin } = require("./utils/cron");


// middleware
app.use(express.json());
// app.use(isAuth);

// Routes
app.use("/user", userRoutes)
app.use("/blog", blogRoutes)
app.use("/follow",followRoutes)

app.listen(PORT, ()=>{
    console.log("server is running at port:",PORT)
    cleanUpBin();
})