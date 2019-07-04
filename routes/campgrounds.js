var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");


// ===============================================================================================
//                                      RESTFUL ROUTES
// ===============================================================================================


router.get('/', (req, res) => {
    // Get all the campgrounds from DB 
    Campground.find({}, (err, allcampgrounds) => {
       if(err){
           console.log(`Error: ` + err)
       } else{
            res.render("campgrounds/Index" , {campgrounds : allcampgrounds});
       }
    });
});
//====================
//        CREATE
//====================

router.post('/',middleware.isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground = {name : name , image : image , description : desc , author : author};
    // Create a new Campground And save It
    Campground.create(newCampground,
        (err , newlyCreated)=>{
            if(err){
                console.log("Error in Adding :" + err);
            }else{  
                console.log(newlyCreated);
                res.render("/campgrounds");
            }
    });
    //redirect to the main page
    req.flash("success", "Successfully Created a Campground!");
    res.redirect("/campgrounds");
});


//====================
//  CREATE A NEW CAMP
//====================
router.get('/new',middleware.isLoggedIn, (req, res) => {
    res.render("campgrounds/new.ejs");
});

// Show More info about the campground
router.get('/:id', (req, res) => {
    //find the data
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
       if(err){
           console.log(`Error: ` + err)
       } else{
           console.log(foundCampground);
           //render the show
           res.render('campgrounds/show' , {campground : foundCampground});
       }
    });  
});

// ===============================================================================================
//                                      EDIT CAMPGROUND ROUTE
// ===============================================================================================

router.get('/:id/edit',middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err , foundCampground)=>{
        res.render('campgrounds/edit', {campground : foundCampground});
    });

});


// ===============================================================================================
//                                      UPDATE CAMPGROUND ROUTE
// ===============================================================================================


router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err , updatedCampground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            req.flash("success", "Successfully Updates Your Campground!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// ===============================================================================================
//                                      DELETE CAMPGROUND ROUTE
// ===============================================================================================
router.delete('/:id',middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findOneAndDelete(req.params.id, (err) => {
       if(err){
           console.log(`Error: ` + err);
           req.flash("error", "Something went Wrong!");
           res.redirect("/campgrounds");
       } else{
           req.flash("success", "Successfully Deleted Your Campground!!");
           res.redirect("/campgrounds");
       }
    });
});




module.exports = router;