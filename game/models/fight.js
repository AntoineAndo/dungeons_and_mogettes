var mongoose = require('mongoose');

// define the schema for our fight model
var fightSchema = mongoose.Schema({
    player_token : String,
    monster_id   : String
});

fightSchema.methods.toString = function() {
    return this.player_token + this.monster_id;
};

// create the model for fight and expose it to our app
module.exports = mongoose.model('Fight', fightSchema);