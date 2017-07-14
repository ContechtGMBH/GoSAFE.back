var pg = require("pg");
var db = require('../config/database');

var client = new pg.Client(db.conString);
    client.connect();

// GeoJSON Feature Collection
function FeatureCollection(){
    this.type = 'FeatureCollection';
    this.crs = { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } };
    this.features = new Array();
}

module.exports = function(app) {

    app.get('/tracks', function(req, res, next) {


        var sql = "SELECT json_build_object('type', 'Feature','id', gid,'geometry', ST_AsGeoJSON(ST_Transform (geom,4326))::jsonb)FROM public.tracks;";

        var query = client.query(sql, function(err, result) {
            var featureCollection = new FeatureCollection();

            for (i = 0; i < result.rows.length; i++)
            {
                featureCollection.features[i] = result.rows[i].json_build_object;
            }
            res.send(featureCollection);
        });
    });

    app.get('/signals', function(req, res, next) {

        var sql = "SELECT json_build_object('type', 'Feature','id', gid,'geometry', ST_AsGeoJSON(ST_Transform (geom,4326))::jsonb)FROM public.signals;";

        var query = client.query(sql, function(err, result) {
            var featureCollection = new FeatureCollection();

            for (i = 0; i < result.rows.length; i++)
            {
                featureCollection.features[i] = result.rows[i].json_build_object;
            }
            res.send(featureCollection);
        });
    });

    app.get('/platforms', function(req, res, next) {

        var sql = "SELECT json_build_object('type', 'Feature','id', gid,'geometry', ST_AsGeoJSON(ST_Transform (geom,4326))::jsonb)FROM public.platforms;";

        var query = client.query(sql, function(err, result) {
            var featureCollection = new FeatureCollection();

            for (i = 0; i < result.rows.length; i++)
            {
                featureCollection.features[i] = result.rows[i].json_build_object;
            }
            res.send(featureCollection);
        });
    });
}
