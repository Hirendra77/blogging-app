const Joi = require("joi");
const User = require("../models/User");
const Follow = require("../models/Follow");

const followUser = async (req, res) => {
  const followerUserId = req.locals.userId;
  const { followingUserId } = req.body;

  const isValid = Joi.object({
    followingUserId: Joi.string().required(),
  }).validate(req.body);

  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "Invalid UserId",
      data: isValid.error,
    });
  }

  //Verify the following UserId

  let followingUserData;
  try {
    followingUserData = await User.findById(followingUserId);

    if (!followingUserData) {
      return res.status(400).send({
        status: 400,
        message: "User doesn't exists",
      });
    }
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch user data",
      data: err,
    });
  }

  // checking if folllower user already follows the followingUser

  try {
    const followObj = await Follow.findOne({ followerUserId, followingUserId });
    if (followObj) {
      return res.status(400).send({
        status: 400,
        message: "User already follows",
      });
    }
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch follow object",
      data: err,
    });
  }

  const followObj = new Follow({
    followerUserId,
    followingUserId,
    creationDateTime: Date.now(),
  });
  try {
    await followObj.save();
    return res.status(201).send({
      status: 201,
      message: "Followed successfully",
    });
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to add follow obj",
      data: err,
    });
  }
};

const unfollowUser = async (req, res) => {
  const followerUserId = req.locals.userId;
  const { followingUserId } = req.body;
  const isValid = Joi.object({
    followingUserId: Joi.string().required(),
  }).validate(req.body);

  if (isValid.error) {
    return res.status(400).send({
      status: 400,
      message: "Invalid UserId",
      data: isValid.error,
    });
  }
  //Verify the following UserId

  let followingUserData;
  try {
    followingUserData = await User.findById(followingUserId);

    if (!followingUserData) {
      return res.status(400).send({
        status: 400,
        message: "User doesn't exists",
      });
    }
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch user data",
      data: err,
    });
  }

  // checking if folllower user  follows the followingUser

  try {
    const followObj = await Follow.findOne({ followerUserId, followingUserId });
    if (!followObj) {
      return res.status(400).send({
        status: 400,
        message: "You don't follow this user",
      });
    }
  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to fetch follow object",
      data: err,
    });
  }

  try {
    await Follow.findOneAndDelete({followerUserId, followingUserId});
    return res.status(200).send({
        status: 200,
        message: "Unfollowed successfully",
      });

  } catch (err) {
    return res.status(400).send({
      status: 400,
      message: "Failed to unfollow user",
      data: err,
    });
  }
};

module.exports = { followUser, unfollowUser };
