var multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage });
var request = require('request')

var _TOKEN_ = '';
var _API_URL_ = 'http://localhost:8000/api/v1/extract/';

module.exports = function(app) {

    app.post('/api/v1/railml', function(req, res, next) {

      var options = {
        url: _API_URL_,

        form: {
          file: req.files.file,
          schema: req.body.schema,
          crs: req.body.crs
        }
      }

      function callback(error, response, body){
        if (error) throw error;
        res.json(JSON.parse(body))
      }
      request.post(options, callback)

    });

}
