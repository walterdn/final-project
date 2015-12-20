module.exports = exports = function(app) {
  require('./controllers/songs_controller')(app);
  require('./controllers/all_songs_controller')(app);
}
