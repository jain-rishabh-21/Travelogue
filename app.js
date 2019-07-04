// ===============================================================================================
//                                      All the required packages
// ===============================================================================================

var express               = require('express'),
    app                   = express(),
    bodyParser            = require('body-parser'),
    mongoose              = require('mongoose'),
    flash                 = require('connect-flash'),
    passport              = require('passport'),
    LocalStrategy         = require('passport-local'),
    methodOverride        = require("method-override"),
    passportLocalMongoose = require('passport-local-mongoose')
    Campground            = require("./models/campground"),
    seedDB                = require("./seeds"),
    Comment               = require("./models/comment"),
    User                  = require("./models/user");


// ===============================================================================================
//                                      All the Required Files
// ===============================================================================================

var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");

// ===============================================================================================
//                                      Connecting Mongoose 
// ===============================================================================================

mongoose.Promise = global.Promise;


mongoose.connect('mongodb://localhost:27017/yelp_camp_v12', {
    useNewUrlParser: true,
    useCreateIndex: true,
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.')
    } else {
        console.log('Error in DB connection: ' + err)
    }
});
// ===============================================================================================
//                                      Seed The DATABASE
// ===============================================================================================
// seedDB();
app.use(flash());
// ===============================================================================================
//                                      PASSWORD CONFIGURATION
// ===============================================================================================

app.use(require("express-session")({
    secret : "I am the best",
    resave : false,
    saveUninitialized : false
}));


app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate())); //all funtions comes with the LocalpassportMongoose
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ===============================================================================================
//                                      App usage
// ===============================================================================================


app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));


app.use((req , res , next)=>{
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

// ===============================================================================================
//                                      Requireing ROUTES
// ===============================================================================================

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds",campgroundRoutes);

// ===============================================================================================
//                                      LISTENING
// ===============================================================================================

app.listen(3000, () => {
    console.log('YelpCamp started !!!');
});