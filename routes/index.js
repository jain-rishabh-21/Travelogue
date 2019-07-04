var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// ===============================================================================================
//                                      Root Route
// ===============================================================================================

router.get('/', (req, res) => {
    res.render("landing");
});


// ===============================================================================================
//                                      AUTH ROUTES
// ===============================================================================================

router.get('/register', (req, res) => {
    res.render("register");
});

router.post('/register', (req, res) => {
    var newUser = new User({username : req.body.username});
    User.register(newUser , req.body.password,(err , user)=>{
        if(err){
            return res.render("register", {"error": err.message});
          }else{
            passport.authenticate("local")(req , res, ()=>{
                req.flash("success", "Welcome To YelpCamp " + user.username + "!!!");
                res.redirect("/campgrounds");
            });
        }
    });
});


// ===============================================================================================
//                                      LOGIN ROUTES
// ===============================================================================================

router.get('/login', (req, res) => {
    res.render("login");
});

router.post('/login', passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}) ,(req, res) => {
    
});
// ===============================================================================================
//                                      LOGOUT ROUTES
// ===============================================================================================

router.get('/logout', (req, res) => {
    req.logout();
    req.flash("success" , "Successfully Logged You Out!!");
    res.redirect("/campgrounds");
});


//===============================================================================================
//                                      Middleware
//===============================================================================================


function isLoggedIn(req , res , next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "Please Login first!!");
        res.redirect("/login");
    }
}

module.exports = router;