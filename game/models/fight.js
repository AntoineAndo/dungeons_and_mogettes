var mongoose = require('mongoose');
var mobSchema = require('./mob');

// define the schema for our fight model
var fightSchema = mongoose.Schema({
	playerTurn  : Boolean,
	information	: String,
    monster 	: {type: mongoose.Schema.Types.ObjectId,  ref: 'Mob'},
    isEnded	: {type: Boolean, default: false}
});

// create the model for fight and expose it to our app
module.exports = mongoose.model('Fight', fightSchema);