const Listing = require("./model/listing");
const ExpressError = require("./utils/ExpressError");
const {listingSchema } = require("./schema");
const Review = require("./model/review");

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash("error", "You must be logged in to perform this action.");
        return res.redirect("/login");
    }
    next();
};


module.exports.saveRedirectUrl = (req,res,next)=>{
   if(req.session.redirectUrl){
    res.locals.redirectUrl = req.session.redirectUrl;
   }
   next();
};


module.exports.isOwner = async(req,res,next)=>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currtUser._id)){
      req.flash("error","You are not the owner of the review");
     return  res.redirect( `/listings/${id}`);
   
    }
    next();
};


module.exports.validateListing = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(', ');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};


module.exports.isAuther = async(req,res,next)=>{
    const { id,reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.auther.equals(res.locals.currtUser._id)){
      req.flash("error","You are not the auther of the review");
     return  res.redirect( `/listings/${id}`);
   
    }
    next();
};