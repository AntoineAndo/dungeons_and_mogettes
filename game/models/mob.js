var mongoose = require('mongoose');

// define the schema for our fight model
var mobSchema = mongoose.Schema({
		name  : String,
    life  : Number,
    exp   : Number,
    gold  : Number
});

// create the model for fight and expose it to our app
module.exports = mongoose.model('Mob', mobSchema);