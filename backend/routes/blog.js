const express = require("express");
const { registerUser, loginUser } = require("../controllers/user.controller");
const { createBlog, getUserBlogs, deleteBlog, editBlog } = require("../controllers/blog.controller");
const { isAuth } = require("../middlewares/AuthMiddleware");
const app = express();

app.post("/create-blog",isAuth, createBlog);
app.get("/get-user-blogs",isAuth, getUserBlogs);
app.delete("/delete-blog/:blogid",isAuth, deleteBlog);
app.put("/edit-blog/",isAuth, editBlog);

module.exports = app;