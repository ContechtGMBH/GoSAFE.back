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

    app.get('/data/:layer', function(req, res, next) {

        // for postgres 9.4+
        var sql = "SELECT json_build_object('type', 'Feature','id', gid,'geometry', ST_AsGeoJSON(ST_Transform (geom,4326))::jsonb)FROM " + req.params.layer;
        // for postgres < 9.4
        var sql_old = "SELECT row_to_json(f) As feature FROM (SELECT 'Feature' As type, ST_AsGeoJSON(ST_Transform (geom,4326))::json As geometry, row_to_json((SELECT l FROM (SELECT gid, descriptio) As l)) As properties FROM " + req.params.layer + " As l) As f;"

        var query = client.query(sql_old, function(err, result) {
            var featureCollection = new FeatureCollection();

            for (i = 0; i < result.rows.length; i++)
            {
                // for postgres 9.4+
                //featureCollection.features[i] = result.rows[i].json_build_object;
                // for postgres <9.4 ex. db.qgiscloud
                featureCollection.features[i] = result.rows[i].feature;
            }
            res.send(featureCollection);
        });
    });
}
