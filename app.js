const express = require("express");
const app = express();

const port = process.env.PORT || 8080;

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const Review = require("./model/review");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const User = require("./model/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
require("dotenv").config();

// MongoDB Connection
const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log(" Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB Connection Error:", err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

// View Engine Setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsmate);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Custom Error Class
class ExpressError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Session Store Setup
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log(" Error in Mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport Setup
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash & User Middleware
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currtUser = req.user;
  next();
});


app.get("/", (req, res) => {
  res.redirect("/listings");
});

// Routes
const listingsRoutes = require("./routes/listings");
const reviews = require("./routes/reviews");
const user = require("./routes/user");

app.use("/listings", listingsRoutes);
app.use("/listings", reviews);
app.use("/", user);

// 404 Handler
app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).send(message);
});

// Start Server
app.listen(port, () => {
  console.log(` Server is running on port ${port}`);
});
