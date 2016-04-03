var parseDbUrl = require("parse-database-url");
var dbConfig = parseDbUrl(process.env.JAWSDB_URL);
//console.log(dbConfig);
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
