const bcrypt = require("bcrypt");
const Joi = require("joi");

const jwt = require("jsonwebtoken");
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId;

const User = require("../models/User");
const Follow = require("../models/Follow");
const BCRYPT_SALTS = Number(process.env.BCRYPT_SALTS);

// Post-- Register User

const registerUser = async (req, res) => {
  //  Data validation

  const isValid = Joi.object({
    name: Joi.string().required(),
    username: Joi.string().min(3).max(30).alphanum().required(),
    password: Joi.string().min(8).required(),
    email: Joi.string().email().required(),
  }).validate(req.body);
  if (isValid.error) {
    res.status(400).send({
      status: 400,
      message: "Invalid Input",
      data: isValid.error,
    });
  }

  // checking EdegeCase whether we have any username or email already existing in our DB
 

  try{
    const userExists = await User.find({$or:[{email:req.body.email},{username:req.body.username}]});
       console.log(userExists)
  if(userExists.length != 0){
    return res.status(400).send({
      status:400,
      message:"username/email already exists",
    });
  }
  }
  catch(err){
    return res.status(400).send({
      status:400,
      message:"Error while checking username and email exists",
      data:err,
    })
  }

  const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALTS);

    const userObj = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try{
  await userObj.save();
  return res.status(201).send({
    status:201,
    message:"User registered successfully",
  });
  }
  catch(err){
    return res.status(400).send({
      status:400,
      message:"Error while save user to DB",
      data:err,
  })
  }
}
  

const loginUser = async (req, res) => {

  const {username, password} = req.body;

  const isValid = Joi.object({
    username:Joi.string().required(),
    password:Joi.string().required(),
  }).validate(req.body)

  if (isValid.error) {
    res.status(400).send({
      status: 400,
      message: "Invalid Username/password",
      data: isValid.error,
    });
  }

  let userData;
try{
  userData = await User.findOne({username})

if(!userData){
  return res.status(400).send({
    status:400,
    message:"No user found! Please register",
})
}

}
catch(err){
  return res.status(400).send({
    status:400,
    message:"Error while fetching user data",
    data:err,
})
}

const isPasswordMatching = bcrypt.compare(
    password,
    userData.password
  );
  if (!isPasswordMatching) {
    return res.status(400).send({
      status: 400,
      message: "Incorrect Password!",
    });
  }

   const payload = {
      username: userData.username,
      name: userData.name,
      email: userData.email,
      userId: userData._id,
    };
    const token =  jwt.sign(payload, process.env.JWT_SECRET);
    return res.status(200).send({
      status: 200,
      message: "Logged in successfully",
      data: {token},
    });
};
const getAllUsers =async (req,res)=>{
  const userId = req.locals.userId;
  let userData ;
  try{
    userData = await User.find({_id:{$ne:userId}});
    if(!userData){
      return res.status(400).send({
        status: 400,
        message: "Failed to fetch all users",
     
      });
    }
  }
  catch(err){
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch all users",
      data: err,
    });
  }

  let followingList;
  try{
    followingList= await Follow.find({followerUserId:userId})
  
  }
  catch(err){
   return res.status(400).send({
      status:400,
      message:"Failed to fetch following users list",
      data:err,
    });
  }

  // console.log(followingList)

  let userList =[]

  let followingMap = new Map()

followingList.forEach((user)=>{
  followingMap.set(user.followingUserId,true)
})

userData.forEach((user)=>{
  if(followingMap.get((user._id.toString()))){
    let userObj = {
      name:user.name,
      username:user.username,
      email:user.email,
      _id:user._id,
      follow:true,
    };
    userList.push(userObj);
  }
  else{
    let userObj = {
      name:user.name,
      username:user.username,
      email:user.email,
      _id:user._id,
      follow:false,
    };
  }
})


  return res.status(200).send({
    status:200,
    message:"All users fetched successfully",
    data:userList,
  })
}

module.exports = { registerUser, loginUser, getAllUsers };
