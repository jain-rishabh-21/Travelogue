var Campground = require('../models/campground');
var Comment = require('../models/comment');
var middleWareObj = {};

//===============================================================================================
//                                          CheckOwnerShip
//===============================================================================================

middleWareObj.checkCampgroundOwnership = function(req , res , next){
        if(req.isAuthenticated()){
            Campground.findById(req.params.id, (err , foundCampground) => {   
            if(err || !foundCampground){
                req.flash("error", "Campground Not Found!");
                console.log(err);
                res.redirect('back');
            }else{
                //Does he own it
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                }else{
                req.flash("error", "You don't have permission to do that!");
                res.redirect('back');
                }
            }
        });
        }else{
            req.flash("error", "You need to be logged in to do that!");
            res.redirect("back");
        }
    }



middleWareObj.checkCommentOwnership= function(req , res , next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, (err , foundComment) => {   
        if(err){
            console.log(err);
            res.redirect('back');
        }else{
            //Does he own it
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }else{
            res.redirect('back');
            }
        }
    });
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}
//===============================================================================================
//                                          Middleware
//===============================================================================================


middleWareObj.isLoggedIn = function(req , res , next) {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("/login");
    }
}
module.exports = middleWareObj;