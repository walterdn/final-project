var express = require('express');
var jsonParser = require('body-parser').json();
var handleError = require(__dirname + '/../lib/handle_server_error');
var basicHttp = require(__dirname + '/../lib/basic_http_authentication');
var User = require(__dirname + '/../models/user');
var eatAuth = require(__dirname + '/../lib/eat_auth');
var authRouter = module.exports = exports = express.Router();

authRouter.post('/signup', jsonParser, function(req, res) {
  var user = new User();
  user.auth.basic.username = req.body.username;
  user.username = req.body.username;
  user.hashPassword(req.body.password);

  user.save(function(err, data) {
    if (user.username === "" || req.body.password === "") return handleError(err, res);

    data.generateToken(function(err, token) {
      res.json({token: token});
    });
  });
});

authRouter.get('/signin', basicHttp, function(req, res) {
  if (!(req.auth.username && req.auth.password)) {
    console.log('no basic auth provided');
    return res.status(401).json({msg: 'need more'});
  }

  User.findOne({'auth.basic.username': req.auth.username}, function(err, user) {
    if (err) {
      console.log('no basic auth provided');
      return res.status(401).json({msg: 'request denied'});
    }

    if (!user) {
      console.log('no basic auth provided');
      return res.status(401).json({msg: 'nope'});
    }

    if (!user.checkPassword(req.auth.password)) {
     console.log('no basic auth provided');
     return res.status(401).json({msg: 'that is incorrect'});
    }

    user.generateToken(function(err, token) {
      res.json({token: token});
   });
  });
});

authRouter.get('/users', eatAuth, function(req, res) {
  res.json({username: req.user.username});
});
