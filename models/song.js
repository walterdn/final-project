var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({
	name: String,
	composer: String,
  chords: Array,
  melody: Array
});

module.exports = mongoose.model('Song', songSchema);
