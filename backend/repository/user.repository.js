const { TRUE, ERR } = require("../constants");
const User = require("../models/User");

const findUsersWithUsernameOrEmail= async (email, username)=>{
  
      let userData ={
        data:null,
        err:null,
      }

    try{

        // DB call  to find if any records exists with email and username given
     userData.data = await User.find({$or : [{email}, { username}] });
    return userData;
    }
    catch(err){
     userData.err = err; 
     return userData;
    }
};
 const addUserToDB = async (userObj) =>{
    try{
   await userObj.save()
   return TRUE;
    }
    catch(err){
    return ERR;
    }
 };

 const getUserDataFromUsername = async (email) =>{
    const userData ={
        data:null,
        err:null,
    };
    try{
        userData.data = await User.findOne({email});
        return userData;
         }
         catch(err){
            userData.err = err;
         return userData;
         }
 };

 const getUserDataFromEmail = async (username) =>{
    const userData ={
        data:null,
        err:null,
    };
    try{
        userData.data = await User.findOne({username});
        console.log(userData.data)
        return userData;
         }
         catch(err){
            userData.err = err;
         return userData;
         }
 }

module.exports = {findUsersWithUsernameOrEmail,addUserToDB, getUserDataFromEmail, getUserDataFromUsername }