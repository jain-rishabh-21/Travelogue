var express = require("express");
var router = express.Router({mergeParams : true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

// ===============================================================================================
//                                      COMMENTS ROUTES
// ===============================================================================================

router.get('/new',middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id , (err , campground)=>{
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {campground:campground});
        }
    });

});


router.post('/',middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id , (err , campground)=>{
        if(err){
            req.flash("error", "Something went Wrong!");
            console.log(err);
            res.redirect("/campgrounds");
        }else{
            Comment.create(req.body.comment , (err , comment)=>{
                if(err){
                    req.flash("error", "Something went wrong!!");
                    console.log(err);
                }else{
                    //add username and id
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save the comment
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully Added your comment!!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });

});


// ===============================================================================================
//                                      COMMENTS  AUTH EDITING
// ===============================================================================================

router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment)=>{
        if(err){
            req.flash("error", "Something Went Wrong!");
            console.log(err);
        }else{
            res.render('comments/edit', {campground_id : req.params.id , comment : foundComment});
        }
    });

});

// ===============================================================================================
//                                      COMMENTS  AUTH UPDATING
// ===============================================================================================

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err , updatedComment)=>{
        if(err){
            req.flash("error", "Something Went Wrong!");            
            console.log(err);
            res.redirect("back");
        }else{
            req.flash("success", "Successfully Updated Your Comment!!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});


// ===============================================================================================
//                                      DELETE COMMENT ROUTE
// ===============================================================================================
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
       if(err){
            req.flash("error", "Something Went Wrong!");    
           console.log(`Error: ` + err);
           res.redirect("back");
       } else{
            req.flash("success", "Successfully Deleted Your Comment!!");
           res.redirect("/campgrounds/" + req.params.id);
       }
    });
});



module.exports = router;