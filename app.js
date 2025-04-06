const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

const mongoose = require("mongoose")
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const Review = require("./model/review");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const User = require("./model/user.js");
const passport = require('passport');
const LocalStrategy = require('passport-local'); 
require('dotenv').config();

const dbUrl = process.env.ATLASDB_URL;
main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.use(express.json());

app.set("view engine" ,"ejs");
app.set("views" , path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));

app.use(methodOverride("_method"));


// use ejs-locals for all ejs templates:
app.engine('ejs', ejsmate);

class ExpressError extends Error {
    constructor(message, statusCode) {
        super(message);  // Call the parent constructor (Error)
        this.statusCode = statusCode;  // Attach statusCode to the error
    }
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET
      },
    touchAfter: 24 * 3600,
});
store.on("error",()=>{
    console.log("Error in Mongo session store",err);
});

const sessionOptions = ({
    store,
    secret :process.env.SECRET,
    resave : false,
    saveUninitialized:true,
    cookie :{
        expires : Date.now + 7 *24 *60 *60 *1000,
        maxAge : 7 *24 *60 *60 *1000,
        httpOnly : true,
    }
 });




app.use(session(sessionOptions));



passport.use(new LocalStrategy(User.authenticate())); // Added strategy initialization
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currtUser = req.user;
    next();
});

// Main page route (home)


//routes
 const listings = require("./routes/listings.js");

 const reviews = require("./routes/reviews.js");
 const user = require("./routes/user.js");
 const listingsRoutes = require('./routes/listings');


 app.use('/listings', listingsRoutes);



app.use("/listings",listings);

app.use("/listings",reviews);

app.use("/" , user);


app.all("*", (req, res, next) => {
    next(new ExpressError("Page not found", 404));  // Handle undefined routes
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    res.status(statusCode).send(message);
});

app.listen(port,()=>{
    console.log(`server is running on the port ${port}`);
});


