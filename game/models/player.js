var mongoose    = require('mongoose');
var fightSchema = require('./fight');

// define the schema for our fight model
var playerSchema = mongoose.Schema({
		name        : String,
		token       : String,
    life        : {type: Number, default: 100},
    maxLife			: {type: Number, default: 100},
    map         : {type : String, default: "start"},
    money       : {type: Number, default: 50},
    fight       : {type: mongoose.Schema.Types.ObjectId,  ref: 'Fight'},
    created_at  : Date,
  	updated_at  : Date,
    fightMoves  : []
});

// on every save, add the date
playerSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;
  // if created_at doesn't exist, add to that field
  if (!this.created_at)
    this.created_at = currentDate;

  next();
});

playerSchema.methods.isInFight = function() {
    return typeof this.fight !== 'undefined' ? true : false;
};

// create the model for fight and expose it to our app
module.exports = mongoose.model('Player', playerSchema);