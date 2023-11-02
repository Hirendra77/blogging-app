const bcrypt = require("bcrypt");
const Joi = require("joi");

const jwt = require("jsonwebtoken");

const User = require("../models/User")
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

const isPasswordMatching = await bcrypt.compare(
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

module.exports = { registerUser, loginUser };
