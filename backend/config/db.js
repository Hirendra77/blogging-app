const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URI)
.then((res)=>{
  console.log("Mongodb connected")

  console.log(err);
})
