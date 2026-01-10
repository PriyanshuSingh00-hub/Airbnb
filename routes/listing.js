const express = require("express");
const router =express.Router();
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError");
const {listingSchema } =require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js")
const listingController = require("../controllers/listing.js")
const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({ storage })


// See all listings.
// Create listing.
router
.route("/")
.get(wrapasync(listingController.index))
.post(
 isLoggedin,
 upload.single("image"),
 validateListing,
  wrapasync(listingController.createListings)
);


// New Route
router.get("/new", isLoggedin,listingController.renderNewForm);


// Show a listing
// Delete listing
// Update listing
router.route("/:id")
.get(wrapasync(listingController.showListings))
.delete(isLoggedin,isOwner, wrapasync(listingController.deleteListings))
.put(
  isLoggedin,
  isOwner,
  upload.single("image"),
  validateListing,
  wrapasync(listingController.updateListing));





// Edit listing form
router.get("/:id/edit",isLoggedin,isOwner, wrapasync(listingController.renderEditForm));



module.exports = router;
