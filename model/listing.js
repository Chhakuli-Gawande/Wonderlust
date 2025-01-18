const mongoose = require("mongoose");

const Schema = mongoose.Schema; 
const Review = require("./review");
const ListingSchema = new mongoose.Schema({
    title :{
        type:String,
        required : true,
    },

    description:{
        type:String,
        required : true,
    },
    image: {

         url :String,
         filename : String,

      },
  

    price :{
        type:String,
        required : true,
    },

    location :{
        type:String,
        required : true,
    },
    country :{
        type:String,
        required : true,
    },

    reviews :[
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],

    owner  :{
        type:Schema.Types.ObjectId,
        ref:"User",
    },

});

ListingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});



const Listing = mongoose.model("Listing" ,ListingSchema );

module.exports = Listing;
