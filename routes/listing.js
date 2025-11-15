const express = require("express");
const router =express.Router();
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError");
const {listingSchema } =require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedin,isOwner,validateListing}=require("../middleware.js")




// See all listings
router.get("/",wrapasync( async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index", { allListings }); // ✅ No .ejs extension
}));

// New Route
router.get("/new", isLoggedin,(req, res) => {
    
    res.render("new.ejs");
});

// Create listing
router.post(
  "/",isLoggedin,validateListing,
  wrapasync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner =req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
  })
);



// Show a listing
router.get("/:id",wrapasync( async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
     .populate( {path : "reviews",populate:{
      path:"author"}}) 
     .populate("owner");
   if (!listing) {
    req.flash("error", "Listing You Requested Does Not Exist!");
    return res.redirect("/listings");  
  }
    res.render("show", { listing });
}));

// Edit listing form
router.get("/:id/edit",isLoggedin,isOwner, wrapasync(async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
      if (!listing) {
    req.flash("error", "Listing You Requested Does Not Exist!");
    return res.redirect("/listings");  
  }
    res.render("edit", { listing });
}));


// Delete listing
router.delete("/:id",isLoggedin,isOwner, wrapasync(async (req, res) => {
   const { id } = req.params;
   await Listing.findByIdAndDelete(id);
    req.flash("success","Listing was Deleted!")
    res.redirect("/listings");
}));

// Update listing
router.put("/:id", 
  isLoggedin,
  isOwner,
    validateListing,
    wrapasync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success","Listing Updated!")
   
    res.redirect(`/listings/${id}`);
}));


module.exports = router;
