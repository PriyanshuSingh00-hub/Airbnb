const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedin,isReviewAuthor} = require("../middleware.js");




// Create Review Route
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapasync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  })
);
// Delete Review Route
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapasync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
     req.flash("success","Review Deleted!")

    res.redirect(`/listings/${id}`);
  })
);

module.exports = router;