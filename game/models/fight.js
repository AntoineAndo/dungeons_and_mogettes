var mongoose = require('mongoose');
var mobSchema = require('./mob');

// define the schema for our fight model
var fightSchema = mongoose.Schema({
	playerTurn  : Boolean,
	information	: String,
<<<<<<< HEAD
	isEnded		: Boolean,
    monster 	: {type: mongoose.Schema.Types.ObjectId,  ref: 'Mob'}
=======
    monster 	: {type: mongoose.Schema.Types.ObjectId,  ref: 'Mob'},
    isEnded	: {type: Boolean, default: false}
>>>>>>> ae8e5d3052448c8766fcdd38600193ad796b1ed3
});

// create the model for fight and expose it to our app
module.exports = mongoose.model('Fight', fightSchema);