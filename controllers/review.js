

const Listing = require("../model/listing");
const Review = require("../model/review");


module.exports.createReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    const { rating, comment } = req.body.review;
    
     let  newReview = new Review(req.body.review);
    newReview.auther = req.user._id;
    console.log(newReview);
     listing.reviews.push(newReview);

     await newReview.save();
     await listing.save();
    
     console.log("Received review data:", req.body.review);
     req.flash("success","New Review Created !");
     res.redirect(`/listings/${listing._id}`);
    
    };


    module.exports.DeleteReview = async(req,res)=>{
             let {id, reviewId} = req.params;
            await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
            await Review.findByIdAndDelete(reviewId);
            req.flash("success","Review Deleted !");
             res.redirect(`/listings/${id}`);
        };