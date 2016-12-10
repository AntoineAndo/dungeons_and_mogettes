var mongoose = require('mongoose');
var mobSchema = require('./mob');

// define the schema for our fight model
var fightSchema = mongoose.Schema({
	playerTurn  : Boolean,
    monster 	: {type: mongoose.Schema.Types.ObjectId,  ref: 'Mob'}
});

// create the model for fight and expose it to our app
module.exports = mongoose.model('Fight', fightSchema);