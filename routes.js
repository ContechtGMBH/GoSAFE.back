module.exports = function(app) {

	require('./routes/index.js')(app);
  require('./routes/postgis.js')(app);
	require('./routes/authentication.js')(app);
	require('./routes/railml.js')(app);
	require('./routes/neo4j.js')(app);
}
