var db = module.exports = {};

var username = "bttnku_oqyzmq";
var password = "2959148a";
var host = "db.qgiscloud.com:5432"
var database = "bttnku_oqyzmq" // database name

db.conString = "postgres://"+username+":"+password+"@"+host+"/"+database; // Your Database Connection
