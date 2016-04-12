var dbConfig = {
	driver: 'mysql',
	host: process.env.MYSQL_HOST,
	port: process.env.MYSQL_PORT,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PASSWORD,
	database: process.env.MYSQL_DATABASE
};

module.exports = {
  mysqlDs: {
    name: "mysqlDs",
    connector: dbConfig.driver,
    hostname: dbConfig.host,
    port: dbConfig.port || 3306,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database
  }
};
