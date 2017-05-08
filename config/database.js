var db = module.exports = {};

var username = "postgres";
var password = "postgres";
var host = "localhost:5432"
var database = "railways" // database name

db.conString = "postgres://"+username+":"+password+"@"+host+"/"+database; // Your Database Connection
