var express = require('express');
var bodyParser = require('body-parser').json();
var Song = require(__dirname + '/../models/song');
var eatAuth = require(__dirname + '/../lib/eat_auth');
var handleError = require(__dirname + '/../lib/handle_server_error');

var songsRouter = module.exports = exports = express.Router();
songsRouter.use(bodyParser);

songsRouter.get('/allsongs', function(req, res) {
  Song.find({}, function(err, data) {
    if (err) return handleError(err, res);

    res.json(data);
  });
});


songsRouter.get('/savedsongs/:username', function (req, res) {
  Song.find({composer : req.params.username}, function(err, data) {
    if (err) return handleError(err, res); 

    res.json(data);
  });
});

songsRouter.post('/savesong', bodyParser, function(req, res) {
  var newSong = new Song(req.body);
  newSong.save(function(err, data) {
    if (err) return handleError(err, res);

    res.json(data);
  });
});

songsRouter.delete('/songs/:id', eatAuth, function(req, res) {
  Song.remove({_id: req.params.id}, function(err) {
    if (err) return handleError(err, res);

    res.json({msg: 'Song Deleted'});
  });
});

