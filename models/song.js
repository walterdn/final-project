var mongoose = require('mongoose');

var songSchema = new mongoose.Schema({

  chords: Array,
  melody: Array
});

module.exports = mongoose.model('Song', songSchema);
