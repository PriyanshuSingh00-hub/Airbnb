const express = require("express");
const router =express.Router();
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError");
const {listingSchema } =require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js")
const listingController = require("../controllers/listing.js")


// See all listings
// Create listing
router
.route("/")
.get(wrapasync(listingController.index))
.post(
 isLoggedin,validateListing,
  wrapasync(listingController.createListings)
);





// New Route
router.get("/new", isLoggedin,listingController.renderNewForm);


// Show a listing
router.get("/:id",wrapasync(listingController.showListings));

// Edit listing form
router.get("/:id/edit",isLoggedin,isOwner, wrapasync(listingController.renderEditForm));


// Delete listing
router.delete("/:id",isLoggedin,isOwner, wrapasync(listingController.deleteListings));

// Update listing
router.put("/:id", 
  isLoggedin,
  isOwner,
    validateListing,
    wrapasync(listingController.updateListings));

module.exports = router;
