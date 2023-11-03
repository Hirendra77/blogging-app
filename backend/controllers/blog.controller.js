const Joi = require("joi");
const Blog = require("../models/Blog");
const { findById } = require("../models/User");




const createBlog = async (req,res)=>{
   const isValid = Joi.object({
     title:Joi.string().required(),
     textBody:Joi.string().min(30).max(1000).required(),
   }).validate(req.body);


   if(isValid.error){
    return res.status(400).send({
        status:400,
        message:"Invalid Input",
        data:isValid.error,
    });
   }
const {title,textBody}= req.body;
   const blogObj = new Blog({
    title,
    textBody,
    creationDateTime: new Date(),
    username: req.locals.username,
    userId: req.locals.userId,
   });

   try{
 await blogObj.save();

 res.status(201).send({
   status:201,
   message:"Blog created successfully",
});
   }
   catch(err){
      return res.status(400).send({
         status:400,
         message:"Failed to create a blog ",
         data:err,
       });
   }
};

const getUserBlogs = async (req,res)=>{
const userId = req.locals.userId;
const page = Number(req.query.page)|| 1;
const LIMIT = 10;

let blogData;
try{
 blogData = await Blog.find({userId})
 .sort({creationDateTime: -1})
 .skip((page-1)*LIMIT)
 .limit(LIMIT);

}
catch(err){
   return res.status(400).send({
      status:400,
      message:"Failed to fetch user blogs ",
      data:err,
    });
};
res.status(200).send({
   status:200,
   message:"Fetched user blogssuccessfully",
   data:blogData,
});
}

const deleteBlog = async (req,res)=>{
const userId = req.locals.userId;
const blogId = req.params.blogid;
let blogData;
try{
blogData = await Blog.findById(blogId);
console.log(blogData)

if(!blogData ){
   return res.status(404).send({
      status:404,
      message:"Blog doesn't exists",
      data:err,
    });
}
if( blogData.userId!=userId){
   return res.status(401).send({
      status:400,
      message:"Unauthorized to delete the blog, You are not the owner of the blog.",
      data:err,
    });
}
}
catch(err){
   return res.status(400).send({
      status:400,
      message:"Failed to fetch  blogs ",
      data:err,
    });
}

try{
await Blog.findByIdAndDelete(blogId);
return res.status(200).send({
   status:200,
   message:"Blog Deleted Successfully ",
  
 });
}
catch(err){
   return res.status(400).send({
      status:400,
      message:"Falied to delete blog ",
      data:err,
    });
}
};

//PUT - Edit blog
const editBlog = async(req,res)=>{
   const isValid = Joi.object({
      blogId:Joi.string().required(),
      title:Joi.string().required(),
      textBody:Joi.string().min(30).max(1000).required(),
    }).validate(req.body);
 
 
    if(isValid.error){
     return res.status(400).send({
         status:400,
         message:"Invalid Input",
         data:isValid.error,
     });
    };

   const {blogId, title, textBody} =req.body;
  const userId = req.locals.userId; 
   let blogData;
   try{
   blogData = await Blog.findById(blogId);
   console.log(blogData)
   
   if(!blogData ){
      return res.status(404).send({
         status:404,
         message:"Blog doesn't exists",
         data:err,
       });
   }
   if( blogData.userId!=userId){
      return res.status(401).send({
         status:400,
         message:"Unauthorized to edit the blog, You are not the owner of the blog.",
         data:err,
       });
   }
   }
   catch(err){
      return res.status(400).send({
         status:400,
         message:"Failed to fetch  blogs ",
         data:err,
       });
   }
   
const creationDateTime = blogData.creationDateTime;
const currentTime = Date.now();

const diff = (currentTime - creationDateTime)/ (1000*60);
// console.log(diff);

if(diff>30){
   return res.status(400).send({
      status:400,
      message:"Not allowed to edit after 30 minutes ",
    });
}

const blogObj ={title,
    textBody,
   };
try{
     await Blog.findByIdAndUpdate(blogId,blogObj );
     return res.status(200).send({
      status:200,
      message:"Blog updated successfully",
    
    });
}
catch(err){
   return res.status(400).send({
      status:400,
      message:"Failed to update blog",
      data:err,
    });
}

};

module.exports = { createBlog,getUserBlogs,deleteBlog,editBlog };