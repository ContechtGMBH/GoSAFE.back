var pg = require("pg");
var db = require('../config/database');

var client = new pg.Client(db.conString);
    client.connect();

// GeoJSON Feature Collection
function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.features = new Array();
}

module.exports = function(app) {

    app.get('/tracks', function(req, res, next) {

        var sql = "select ST_AsGeoJSON(tracks.geom) as shape from public.tracks;";

        var query = client.query(sql, function(err, result) {
            var featureCollection = new FeatureCollection();

            for (i = 0; i < result.rows.length; i++)
            {
                featureCollection.features[i] = JSON.parse(result.rows[i].shape);
            }
            res.send(featureCollection);
        });
    });

    app.get('/tunnels', function(req, res, next) {

        var sql = "select ST_AsGeoJSON(tunnels.geom) as shape from public.tunnels;";

        var query = client.query(sql, function(err, result) {
            var featureCollection = new FeatureCollection();

            for (i = 0; i < result.rows.length; i++)
            {
                featureCollection.features[i] = JSON.parse(result.rows[i].shape);
            }
            res.send(featureCollection);
        });
    });
}
