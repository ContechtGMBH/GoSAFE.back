var ira = require('../utils/irishrail');

module.exports = function(app) {

    app.get('/api/v1/realtime/getcurrenttrains', function(req, res, next) {
      ira.getCurrentTrains().then( (trains) => {
        res.json(trains)
      })
    })
    
}
