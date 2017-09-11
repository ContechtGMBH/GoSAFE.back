
module.exports = function(app) {

    app.post('/login', function(req, res, next) {
      var emails = ['harasymczuk@contecht.eu', 'hartmann@contecht.eu', 'ungureanu@contecht.eu', 'borun@contecht.eu'];
      var login = req.body.login;
      var password = req.body.password;
      var email = (emails.indexOf(login) > -1);
      if (email && password == 'test'){
        res.json(true)
      } else {
        res.json(false)
      }
    });

}
