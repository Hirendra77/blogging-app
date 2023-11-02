const express = require("express");
require("dotenv").config();

const app = express();
const PORT = 8081;

//file imports
const db = require("./config/db"); 
const userRoutes = require("./routes/user");
const blogRoutes = require("./routes/blog");
const { isAuth } = require("./middlewares/AuthMiddleware");

// middleware
app.use(express.json());
// app.use(isAuth);

// Routes
app.use("/user", userRoutes)
app.use("/blog", blogRoutes)

app.listen(PORT, ()=>{
    console.log("server is running at port:",PORT)
})