
var Position = function(latitude, longitude) {

};

// Latitude
Player.prototype.SetLatitude = function(latitude) {
	this._latitude = latitude;
};

Player.prototype.GetLatitude = function() {
	return this._latitude;
};

// Longitude
Player.prototype.SetLongitude = function(longitude) {
	this._longitude = longitude;
};

Player.prototype.GetLongitude = function() {
	return this._longitude;
};


module.exports = Position;