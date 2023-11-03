const express = require("express");
const { registerUser, loginUser } = require("../controllers/user.controller");
const { createBlog, getUserBlogs, deleteBlog, editBlog, getHomePageBlogs } = require("../controllers/blog.controller");
const { isAuth } = require("../middlewares/AuthMiddleware");
const app = express();

app.post("/create-blog",isAuth, createBlog);
app.get("/get-user-blogs",isAuth, getUserBlogs);
app.delete("/delete-blog/:blogid",isAuth, deleteBlog);
app.put("/edit-blog/",isAuth, editBlog);
app.get('/homepage-blogs', isAuth, getHomePageBlogs);

module.exports = app;