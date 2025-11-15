const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./reviews.js")

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      set: (v) =>
        v === ""
          ? "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
          : v,
    },
  },

  price: {
    type: Number,
    default: 0,
  },

  location: String,
  country: String,


  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "review", 
    },
  ],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
  if (listing){
    await Review.deleteMany({_id: {$in:listing.reviews}})
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
