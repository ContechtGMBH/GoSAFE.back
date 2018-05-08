var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:test@localhost:7474/db/data');

var elementColors = {
  "Track": "#ff6666",
  "Switch": "#800000",
  "Connection": "#3d003d",
  "Signal": "#aafeaa",
  "SpeedChange": "#ead7c7",
  "GradientChange": "#2e2125",
  "RadiusChange": "#695250",
  "BufferStop": "#b8bcc8",
  "PlatformEdge": "#db2323"

}


module.exports = function(app) {
   /**
     * @api {GET} /api/v1/tracks
     * @apiDescription Get all tracks from the database (all nodes with the 'Track' label). Executes a cypher query.
     * @apiName GetTracks
     * @apiGroup Neo4j
     * @apiSuccess (200) {array} tracks an array of objects (graph nodes), representing the railway network
     */
    app.get('/api/v1/tracks', function(req, res) {
      db.cypher({
        query: 'MATCH (n:Track)-[:HAS_TRACK]-(l) RETURN n,l'
      }, function (err, results) {
        if (err) throw err;
        res.json(results)
      });
    })

   /**
     * @api {POST} /api/v1/elements
     * @apiDescription Get all nodes related to the given track. Relation between the track and elements are RailMl relations. Executes a cypher query.
     * @apiName GetTrackElements
     * @apiGroup Neo4j
     * @apiParam {string} id  a track id
     * @apiSuccess (200) {array} elements an array of objects (graph nodes), representing the given track and related elements
     */
    app.post('/api/v1/elements', function(req, res) {
      db.cypher({
        query: 'MATCH (n:Track)-[:BEGINS|ENDS|HAS_SWITCH|HAS_TRACK_ELEMENT|HAS_OCS_ELEMENT]->(e) WHERE n.id={track_id} RETURN e',
        params: {
          track_id: req.body.id
        }
      }, function (err, results) {
        if (err) throw err;
        res.json(results)
      });
    })

   /**
     * @api {POST} /api/v1/add/element
     * @apiDescription Creates a new node related to the given track. Executes a cypher query.
     * @apiName AddElement
     * @apiGroup Neo4j
     * @apiParam {string} label a label for a new node
     * @apiParam {string} relationship relationship between a new node and the given track
     * @apiParam{string} track_id given track id
     * @apiParam {string} properties new node properties
     * @apiSuccess (200) {boolean} created returns true
     */
    app.post('/api/v1/add/element', function(req, res) {
      db.cypher({
        query: 'MATCH (t:Track) WHERE t.id={track_id} CREATE (s:' + req.body.label + '{properties})<-[:' + req.body.relationship + ']-(t)', // string concatenations are not recommended
        params: {
          track_id: req.body.track_id,
          properties: req.body.properties
        }
      }, function (err, results) {
        if (err) throw err;
        res.json(true)
      });
    })

   /**
     * @api {POST} /api/v1/remove/element
     * @apiDescription Removes given element from the database. Executes a cypher query.
     * @apiName RemoveElement
     * @apiGroup Neo4j
     * @apiParam {string} label  a label for the removed node
     * @apiParam {string} id an id for the removed node
     * @apiSuccess (200) {boolean} removed returns true
     */
    app.post('/api/v1/remove/element', function(req, res) {
      db.cypher({
        query: 'MATCH (n:`' + req.body.label + '` {id:' + req.body.id + '}) DETACH DELETE n', // string concatenations are not recommended
      }, function (err, results) {
        if (err) throw err;
        res.json(true)
      });
    })

   /**
     * @api {POST} /api/v1/remove/track
     * @apiDescription Removes given track from the database. Executes a cypher query.
     * @apiName RemoveTrack
     * @apiGroup Neo4j
     * @apiParam {string} id an id for the removed node
     * @apiSuccess (200) {boolean} removed returns true
     */
    app.post('/api/v1/remove/track', function(req, res) {
      db.cypher({
        query: 'MATCH (e)-[]-(t:`Track` {id:' + req.body.id + '})-[]-(s)-[:HAS_CONNECTION]-(c:Connection) DETACH DELETE t,e,s,c', // string concatenations are not recommended
      }, function (err, results) {
        if (err) throw err;
        res.json(true)
      });
    })

    /**
      * @api {POST} /api/v1/tracktograph
      * @apiDescription Returns the given track and all related elements as a graph vis input. Executes a cypher query.
      * @apiName TrackToGraph
      * @apiGroup Neo4j
      * @apiParam {string} id a track id
      * @apiSuccess (200) {object} graph returns an object with nodes and edges, that can be loaded in vis.js
      */
    app.post('/api/v1/tracktograph', function(req, res) {
      db.cypher({
        query: 'MATCH (n:Track {id: "' + req.body.id + '"})-[r]->(e) RETURN n,r,e', // string concatenations are not recommended

      }, function (err, results) {
        if (err) throw err;
        var graph = {
          nodes: [],
          edges: []
        }
        if (results.length){
          var trackNode = {}
          trackNode.properties = results[0].n.properties
          trackNode.id = results[0].n.properties.id
          trackNode.label = results[0].n.labels[0]
          trackNode.color = elementColors[trackNode.label] || '#0000ff'

          graph.nodes.push(trackNode)

          results.forEach((item) => {
            var elementNode = {}
            elementNode.properties = item.e.properties
            elementNode.id = item.e.properties.id
            elementNode.label = item.e.labels[0]
            elementNode.color = elementColors[elementNode.label]

            if (elementNode.id && elementNode.label){
              graph.nodes.push(elementNode)
              graph.edges.push({from: trackNode.id, to: elementNode.id, label: item.r.type})
            }

          })
        } else {
          graph.nodes.push({id: req.body.id, label: "Track", color: elementColors["Track"], properties: {}})
        }
        res.json(graph)
      });
    })

    /**
      * @api {POST} /api/v1/elementstograph
      * @apiDescription Node expanding. Returns all related nodes to the given one. Executes a cypher query.
      * @apiName ElementsToGraph
      * @apiGroup Neo4j
      * @apiParam {string} label a given node label
      * @apiParam {string} id a given node id
      * @apiSuccess (200) {object} graph returns an object with nodes and edges, that can be loaded in vis.js
      */
    app.post('/api/v1/elementstograph', function(req, res) {
      db.cypher({
        query: 'MATCH (n:`' + req.body.label + '` {id: "' + req.body.id + '"})-[r]-(e) WHERE TYPE(r)<>"HAS_TRACK" RETURN n,r,e', // string concatenations are not recommended

      }, function (err, results) {
        if (err) throw err;
        var graph = {
          nodes: [],
          edges: []
        }
        var mainNode = req.body.id

        results.forEach((item) => {
          var elementNode = {}
          elementNode.properties = item.e.properties
          elementNode.id = item.e.properties.id || item.e._id
          elementNode.label = item.e.labels[0] || "Unknown"
          elementNode.color = elementColors[elementNode.label]

          graph.nodes.push(elementNode)

          graph.edges.push({from: mainNode, to: elementNode.id, label: item.r.type})

        })
        res.json(graph)
      });
    })

    /**
      * @api {POST} /api/v1/neighbourhood
      * @apiDescription Returns all not related to the railway network objects within the given distance to the track. Executes a cypher query.
      * @apiName Neighbourhood
      * @apiGroup Neo4j
      * @apiParam {string} wkt a valid wkt string (multipolygon or polygon)
      * @apiSuccess (200) {object} results returns an array of spatial objects (graph nodes)
      */
    app.post('/api/v1/neighbourhood', function(req, res) {
      db.cypher({
        query: "CALL spatial.intersects('buildings', '" + req.body.wkt + "')"
      }, function (err, results) {
        if (err) throw err;
        res.json(results)
      });
    })

    /**
      * @api {GET} /api/v1/spatial/layers
      * @apiDescription Returns all spatial layers existing in the database. Executes a cypher query.
      * @apiName Neighbourhood
      * @apiGroup Neo4j
      * @apiSuccess (200) {array} result returns an array of strings
      */
    app.get('/api/v1/spatial/layers', function(req,res){
      db.cypher({
        query: "CALL spatial.layers()"
      }, function (err, layers) {
        if (err) throw err;
        var result = layers.map(function(layer){return layer.name})
        res.json(result)
      });
    })

}
