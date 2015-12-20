var eat = require('eat');
var User = require(__dirname + '/../models/user');

module.exports = exports = function(req, res, next) {
  var token = req.headers.token;
  var bodyToken = (req.body)? req.body.token : '';
  token = token || bodyToken;
  if (!token) {
    console.log('no token');
    return res.status(401).json({msg: 'not allowed'});
  }

  eat.decode(token, process.env.APP_SECRET, function(err, decoded) {
    if (err) {
      console.log(err);
      return res.status(401).json({msg: 'not allowed'});
    }

    User.findOne({_id: decoded.id}, function(err, user) {
      if (err) {
        console.log(err);
        return res.status(401).json({msg: 'not allowed'});
      }

      if (!user) {
        console.log(err);
        return res.status(401).json({msg: 'not allowed'});

      }

      req.user = user;
      next();
    });
  });
};
