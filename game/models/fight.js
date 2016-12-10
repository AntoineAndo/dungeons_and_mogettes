var mongoose = require('mongoose');
var bcrypt   = require('bcryptjs');

// define the schema for our fight model
var fightSchema = mongoose.Schema({
    player_token : String,
    monster_id   : String
});

// checking if password is valid using bcrypt
fightSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// this method hashes the password and sets the fight's password
fightSchema.methods.hashPassword = function(password) {
    var fight = this;

    // hash the password
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err)
            return next(err);

        fight.local.password = hash;
    });

};

// create the model for fight and expose it to our app
module.exports = mongoose.model('Fight', fightSchema);