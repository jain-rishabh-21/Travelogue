var mongoose = require('mongoose'); // Erase if already required
var passportLocalMongoose = require('passport-local-mongoose');
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
    username:String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

//Export the model
module.exports = mongoose.model('User', userSchema);