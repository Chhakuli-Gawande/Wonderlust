const express = require("express");

const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const Review = require("../model/review");
const Listing = require("../model/listing");
const {isLoggedIn,isAuther} = require("../middleware");
const reviewController = require("../controllers/review");

router.get('/search', (req, res) => {
    res.send('Search route is working!');
  });