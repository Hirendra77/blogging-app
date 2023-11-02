const express = require("express");
const { registerUser, loginUser } = require("../controllers/user.controller");
const { createBlog } = require("../controllers/blog.controller");
const { isAuth } = require("../middlewares/AuthMiddleware");
const app = express();

app.post("/create-blog",isAuth, createBlog);


module.exports = app; 