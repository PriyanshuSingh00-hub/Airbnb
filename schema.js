const Joi = require('joi');

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(), 
    location: Joi.string().required(),
    country: Joi.string().required(),
    price: Joi.number().required().min(0), 

    //  FIXED: image must be an object, not a string
    image: Joi.object({
      url: Joi.string().allow("", null),
      filename: Joi.string().allow("", null),
    }).optional(),

    // Geometry for map coordinates
    geometry: Joi.object({
      type: Joi.string().default('Point'),
      coordinates: Joi.array().items(Joi.number()).length(2).default([77.2090, 28.6139])
    }).optional(),
  }).required(),
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required()
}).prefs({ convert: true });