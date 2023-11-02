const Joi = require("joi");
const Blog = require("../models/Blog")
const ERR = require("../constants")
const { addBlogToDB } = require("../repository/blog.repository");


const createBlog = async (req,res)=>{
   const isValid = Joi.object({
     title:Joi.string().required(),
     textBody:Joi.string().min(30).max(1000).required(),
   }).validate(req.body);


   if(isValid.error){
    return res.status(400).send({
        status:400,
    message:"Invalid data format",
    data:isValid.error,
    data:isValid.error,
    });
   }
const {title,textBody}= req.body;
   const blogObj = new Blog({
    title,
    textBody,
    username: req.locals.username,
    userId: req.locals.userId,
   });
   const response = await addBlogToDB(blogObj);
   if(response===ERR){
    return res.status(400).send({
      status:400,
      message:"DB Error: addBlogToDB failed",
    });
   }
   res.status(201).send({
      status:201,
      message:"Blog created successfully",
   });
};

module.exports = { createBlog };