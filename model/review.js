
const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reviewSchema = new Schema({
    comment :{
        type:String,
        required: [true, 'Comment is required'],
    },
    rating :{
        type:Number,
        min:1,
        max:5,
        required: [true, 'Rating is required'],

    },
    createdAt:{ 
        type:Date,
        default : Date.now(),

    },
    auther :{
        type :Schema.Types.ObjectId,
        ref:"User",
    },
   
});

module.exports = mongoose.model("Review",reviewSchema );