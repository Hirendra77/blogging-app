const { TRUE, FALSE, ERR } = require("../constants");
const User = require("../models/User");
const { findUsersWithUsernameOrEmail } = require("../repository/user.repository");

const verifyUsernameAndEmailExists = async (email, username)=>{
  const userData = await findUsersWithUsernameOrEmail(email, username)

//   Different state of response
  if(userData.err){
    return ERR;
  }
  else if(userData.data.length !== 0){
    return TRUE;
  }
  else{
    return FALSE;
  };
}

module.exports = {verifyUsernameAndEmailExists}