var mongoose = require('mongoose');

// define the schema for our fight model
var mobSchema = mongoose.Schema({
	name  		: String,
    life  		: Number,
    maxLife		: Number,
    exp   		: Number,
    gold  		: Number,
    reference 	: String
});

// create the model for fight and expose it to our app
module.exports = mongoose.model('Mob', mobSchema);