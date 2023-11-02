    const jwt = require('jsonwebtoken')

    const isAuth = (req,res,next)=>{
         const token = req.headers["x-acciojob"];

         let verified
         try{
           verified = jwt.verify(token,process.env.JWT_SECRET); 
         }
         catch(err){
          return  res.status(400).send({
                status:400,
                message:"JWT not provided. Please login",
                data:err,
            });
         }
         
//if verified successfull we get payload completely who is logging in
         if(verified){
          req.locals = verified; //saving user data at locals and every request has separate locals
            next()
         }
         else{
            res.status(401).send({
                status:401,
                message:"User not authenticated. Please login",
            })
         }
    }

    module.exports ={isAuth}