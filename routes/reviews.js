const express = require("express");

const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../model/review");
const Listing = require("../model/listing");
const {isLoggedIn,isAuther} = require("../middleware");
const reviewController = require("../controllers/review");
//review route
//post

router.post("/:id/reviews" ,isLoggedIn,reviewController.createReview);
    
    
 // delete review route
    router.delete("/:id/reviews/:reviewId",isLoggedIn,isAuther,reviewController.DeleteReview);
    

    module.exports = router;