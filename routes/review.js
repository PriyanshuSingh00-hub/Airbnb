const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapasync = require("../utils/wrapasync.js");
const ExpressError = require("../utils/ExpressError");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");
const {validateReview, isLoggedin,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js")




// Create Review Route.
router.post(
  "/",
  isLoggedin,
  validateReview,
  wrapasync(reviewController.createReview)
);
// Delete Review Route.
router.delete(
  "/:reviewId",
  isLoggedin,
  isReviewAuthor,
  wrapasync(reviewController.destroyReview)
);

module.exports = router;
