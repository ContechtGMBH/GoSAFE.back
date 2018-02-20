var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:test@localhost:7474/db/data');

var elementColors = {
  "Track": "#ff6666",
  "Switch": "#800000",
  "Connection": "#3d003d",
}

var linkColors = {
  "BEGINS": "#DAF7A6",
  "ENDS": "#FF5733",
  "HAS_SWITCH": "#C70039",
  "HAS_TRACK_ELEMENT": "#3498DB",
  "HAS_OCS_ELEMENT": "#45B39D",
}


module.exports = function(app) {

    app.get('/api/v1/tracks', function(req, res) {
      db.cypher({
        query: 'MATCH (n:Track) RETURN n'
      }, function (err, results) {
        if (err) throw err;
        res.json(results)
      });
    })

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

    app.post('/api/v1/add/element', function(req, res) {
      db.cypher({
        query: 'MATCH (t:Track) WHERE t.id={track_id} CREATE (s:' + req.body.label + '{properties})<-[:' + req.body.relationship + ']-(t)', // string concatenations are not recommended
        params: {
          track_id: req.body.track_id,
          properties: req.body.properties
        }
      }, function (err, results) {
        if (err) throw err;
        res.json(results)
      });
    })

    app.post('/api/v1/remove/element', function(req, res) {
      db.cypher({
        query: 'MATCH (n:`' + req.body.label + '` {id:' + req.body.id + '}) DETACH DELETE n', // string concatenations are not recommended
      }, function (err, results) {
        if (err) throw err;
        res.json(results)
      });
    })

    app.post('/api/v1/tracktograph', function(req, res) {
      db.cypher({
        query: 'MATCH (n:Track {id: "' + req.body.id + '"})-[r]->(e) RETURN n,r,e', // string concatenations are not recommended

      }, function (err, results) {
        if (err) throw err;
        var graph = {
          nodes: [],
          links: []
        }
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

          graph.nodes.push(elementNode)

          graph.links.push({source: trackNode.id, target: elementNode.id, label: item.r.type})

        })
        res.json(graph)
      });
    })

    app.post('/api/v1/elementstograph', function(req, res) {
      db.cypher({
        query: 'MATCH (n:`' + req.body.label + '` {id: "' + req.body.id + '"})-[r]-(e) RETURN n,r,e', // string concatenations are not recommended

      }, function (err, results) {
        if (err) throw err;
        var graph = {
          nodes: [],
          links: []
        }
        var mainNode = req.body.id

        results.forEach((item) => {
          var elementNode = {}
          elementNode.properties = item.e.properties
          elementNode.id = item.e.properties.id
          elementNode.label = item.e.labels[0]
          elementNode.color = elementColors[elementNode.label]

          graph.nodes.push(elementNode)

          graph.links.push({source: mainNode, target: elementNode.id, label: item.r.type})

        })
        res.json(graph)
      });
    })

    app.post('/api/v1/neighbourhood', function(req, res) {
      db.cypher({
        query: "CALL spatial.intersects('buildings', '" + req.body.wkt + "')"
      }, function (err, results) {
        if (err) throw err;
        res.json(results)
      });
    })

}
