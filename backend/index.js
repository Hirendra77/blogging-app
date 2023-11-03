const express = require("express");
require("dotenv").config();
const cors = require("cors");

//file imports
const db = require("./config/db"); 
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const followRoutes = require("./routes/follow");
const { cleanUpBin } = require("./utils/cron");


const app = express();
const PORT = 9560;

// middleware
app.use(express.json());
app.use(cors({
        origin:"*",
}))
// app.use(isAuth);

// Routes
app.use("/user", userRoutes)
app.use("/blog", blogRoutes)
app.use("/follow",followRoutes)

app.listen(PORT, ()=>{
    console.log("server is running at port:",PORT)
    cleanUpBin();
})