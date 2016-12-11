var mongoose    = require('mongoose');
var fightSchema = require('./fight');

// define the schema for our fight model
var playerSchema = mongoose.Schema({
		name        : String,
		token       : String,
    life        : Number,
    map         : {type : String, default: "start"},
    money       : {type: Number, default: 0},
    fight       : {type: mongoose.Schema.Types.ObjectId,  ref: 'Fight'},
    created_at  : Date,
  	updated_at  : Date
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
    return this.fight === undefied ? false : true;
};

// create the model for fight and expose it to our app
module.exports = mongoose.model('Player', playerSchema);