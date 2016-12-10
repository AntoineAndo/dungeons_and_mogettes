function DatabaseConfig(){
		this.databaseType = 'mongodb';
		this.user = 'admin';
		this.password = 'jordy';
		this.hostname = 'ds119368.mlab.com';
		this.port = '19368';
		this.databaseName = 'mogettedb';

		this.getConnectionString = function(){
			var connectionString = "";
			connectionString = connectionString.concat(
				this.databaseType, '://',
				this.user, ':',
				this.password, '@',
				this.hostname, ':',
				this.port, '/',
				this.databaseName	
			);
			return connectionString;
		}
};

module.exports = DatabaseConfig;