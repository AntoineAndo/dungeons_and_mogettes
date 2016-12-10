
var Player = function(data) {

};

// Life
Player.prototype.SetHP = function(hp) {
	this._hp = hp;
};

Player.prototype.GetHP = function() {
	return this._hp;
};

// Position
Player.prototype.SetPosition = function(position) {
	this._position = position;
};

Player.prototype.GetPosition = function() {
	return this._position;
};


module.exports = Player;