if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const Review = require("./models/reviews.js");

const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport= require("passport");
const LocalStrategy=require("passport-local");
const User= require("./models/user.js")


const listingsRouter = require("./routes/listing.js");   //listinggggg routersss!
const reviewRouter = require("./routes/review.js");
const userRouter= require("./routes/userRouter.js");

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const dbUrl=process.env.ATLASDB_URL

// -------------------------
// Connect to MongoDB
main()
  .then(() => console.log("Connected to server"))
  .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
}

// -------------------------
// EJS-Mate setup
app.engine("ejs", ejsMate);          // Must come first
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));


const store =MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:"mysupersecretcode"
  },
  touchAfter:24*3600,
})

store.on("error",(err)=>{
  console.log("ERROR IN MONGO SESSION STORE",err)
})

const sessionOptions = {
  store,
  secret: "mysupersecretcode",
  resave:false,
  saveUninitialized:true,
  cookie :{
    expires:Date.now() + 7 * 24 * 60 *60* 1000,
    maxAge : 7 * 24 * 60 * 60* 1000,

  }
}


// Home route
// app.get("/", (req, res) => {
//     res.send("hi, I'm working");
// });



app.use(session(sessionOptions))
app.use(flash());                  // used for session nd cookies

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());





app.use((req,res,next) =>{
  res.locals.success=req.flash("success") 
   res.locals.error=req.flash("error") //key 
   res.locals.currUser = req.user;
next();
})




app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews/",reviewRouter)   //helps not to use same name multiple times
app.use("/",userRouter)





// -------------------------
// 404 Handler (Page Not Found)
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

// -------------------------
// Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

// -------------------------
app.listen(8080, () => {
  console.log("Server is listening on port 8080");
});

