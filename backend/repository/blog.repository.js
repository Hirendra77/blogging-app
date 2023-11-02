const {TRUE,ERR} = require("../constants");

const addBlogToDB = async(blogObj)=>{
    try{
await blogObj.save();
return TRUE;
    }catch(err){
return ERR;
    }
}
module.exports = {addBlogToDB}