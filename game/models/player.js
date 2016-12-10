var mongoose = require('mongoose');

// define the schema for our fight model
var playerSchema = mongoose.Schema({
		name: String,
		token : String,
    life : Number,
    map : {type : String, default: "start"},
    money: {type: Number, default: 0},
    created_at: Date,
  	updated_at: Date
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

playerSchema.methods.createAccount = function() {
    return this.player_token + this.monster_id;
};

// create the model for fight and expose it to our app
module.exports = mongoose.model('Player', playerSchema);