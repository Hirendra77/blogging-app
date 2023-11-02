const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const BlogSchema = new Schema({
    title:{
        type:String,
        required:true,
    },
    textBody:{
        type:String,
        required:true,
    },
    creationDateTime:{
        type:Date,
        required:true,
    },
    userId :{
        type: Schema.Types.ObjectId,
        required:true,
    },
    username:{
        type:String,
        required:true,
    }
})

module.exports = mongoose.model("blogs",BlogSchema);