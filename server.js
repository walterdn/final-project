var express = require('express');
var app = express();
var mongoose = require('mongoose');
var port = process.env.PORT || 3000;
var songsRouter = require(__dirname + '/routes/songs_routes');
var authRouter = require(__dirname + '/routes/auth_routes');

process.env.APP_SECRET = process.env.APP_SECRET || 'hello';

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://heroku_dh1ztl0r:hae5nmcsuh3tteoi3i1r0cd6kn@ds033875.mongolab.com:33875/heroku_dh1ztl0r');

app.use(express.static(__dirname + '/build'));

app.use('/api', authRouter);
app.use('/api', songsRouter);

app.listen(port, function() {
  console.log('Server up on port ' + port);
});

