const Listing= require("../models/listing")

module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("index", { allListings }); 
}// ✅ No .ejs extension

module.exports.renderNewForm=(req, res) => {
    res.render("new.ejs");
}


module.exports.showListings=async (req, res) => {
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
}

module.exports.createListings =async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner =req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!")
    res.redirect("/listings");
  }

module.exports.renderEditForm =async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
      if (!listing) {
    req.flash("error", "Listing You Requested Does Not Exist!");
    return res.redirect("/listings");  
  }
    res.render("edit", { listing });
}

module.exports.updateListings =async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
     req.flash("success","Listing Updated!")
   
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListings=async (req, res) => {
   const { id } = req.params;
   await Listing.findByIdAndDelete(id);
    req.flash("success","Listing was Deleted!")
    res.redirect("/listings");
}