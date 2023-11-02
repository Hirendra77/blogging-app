const bcrypt = require("bcrypt");
const Joi = require("joi");
const { TRUE, ERR } = require("../constants");
const jwt = require("jsonwebtoken");
const {
  verifyUsernameAndEmailExists,
} = require("../utils/verifyEmailUsername");
const User = require("../models/User");
const {
  addUserToDB,
  getUserDataFromUsername,
  getUserDataFromEmail,
} = require("../repository/user.repository");

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
  const isUserExisting = await verifyUsernameAndEmailExists(
    req.body.email,
    req.body.username
  );
  console.log(isUserExisting);

  if (isUserExisting === TRUE) {
    return res.status(400).send({
      status: 400,
      message: "Email or Username already exists",
    });
  } else if (isUserExisting === ERR) {
    return res.status(400).send({
      status: 400,
      message: "ERR: verifyUsernameAndEmailExists failed !",
    });
  }
  const hashedPassword = await bcrypt.hash(req.body.password, BCRYPT_SALTS);

  const userObj = new User({
    name: req.body.name,
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  // Adding userdata to data base
  const response = await addUserToDB(userObj);

  if (response === ERR) {
    res.status(400).send({
      status: 400,
      message: "DB Error: Failed to add new user",
    });
  } else if (response === TRUE) {
    res.status(201).send({
      status: 201,
      message: "User added successfully",
    });
  }
};

const loginUser = async (req, res) => {
  const { loginId, password } = req.body;

  const isEmail = Joi.object({
    loginId: Joi.string().email().required(),
  }).validate({loginId});

  let userData;
  if (isEmail.error) {
    userData = await getUserDataFromUsername(loginId);
    if (userData.err) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getUserDataFromUsername Failed",
        data: userData.err,
      });
    }
  } else {
    userData = await getUserDataFromEmail(loginId);
    if (userData.err) {
      return res.status(400).send({
        status: 400,
        message: "DB Error: getUserDataFromUsername Failed",
        data: userData.err,
      });
    }
  }
  if (!userData.data) {
    return res.status(400).send({
      status: 400,
      message: "No user found! Please register",
    });
  }
  const isPasswordMatching = await bcrypt.compare(
    password,
    userData.data.password
  );
  if (!isPasswordMatching) {
    return res.status(400).send({
      status: 400,
      message: "Incorrect Password!",
    });
  }

  const payload = {
    userData: userData.data.username,
    name: userData.data.name,
    email: userData.data.email,
    userId: userData.data._id,
  };
  const token = await jwt.sign(payload, process.env.JWT_SECRET);
  res.status(200).send({
    status: 200,
    message: "Loggedin successfully",
    data: {
      token,
    },
  });
};

module.exports = { registerUser, loginUser };
