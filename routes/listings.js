const express = require("express");
const router = express.Router();
const path = require("path");

const Listing = require('../model/listing');


const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../model/review");
const { isAuthenticated } = require("../middleware");
const {isOwner,isLoggedIn } = require("../middleware");

const listingControllers = require("../controllers/listings");
const SearchListingController = require("../controllers/listings");

const multer = require('multer');
const { cloudinary, storage } = require('../cloudeconfig');
const upload = multer({ storage });
 // adjust path as needed


// index route and create route

router.route("/")
.get(( listingControllers.index))

.post( isLoggedIn,
  upload.single('listing[image]'),
  wrapAsync(listingControllers.createListing));

// Search route
router.get('/search', wrapAsync(SearchListingController.SearchListing ));

  // Create Route & new route 
  router.get("/new", isLoggedIn , listingControllers.renderNewForm);
  
  //edit 
  
  router.get("/:id/edit",isLoggedIn ,isOwner, wrapAsync(listingControllers.editListings));

  //show route & update & delte route
  router.route("/:id",)
 .get(listingControllers.showListing)
 .put( isLoggedIn , isOwner,  upload.single('listing[image]'),wrapAsync(listingControllers.UpdateListing))
 .delete(isLoggedIn,isOwner ,wrapAsync(listingControllers.DeleteListing));
 

  
 
  module.exports = router;