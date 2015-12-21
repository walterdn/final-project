var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);
var expect = chai.expect;

process.env.MONGO_URI = 'mongodb://localhost/songs_test';
var server = require(__dirname + '/../../server.js');
var mongoose = require('mongoose');
var url = 'localhost:3000/api';
var Song = require(__dirname + '/../../models/song');

describe('song routes', function() {

  before(function(done) {
    var testUser = {username: 'test', password: 'testing123'};
    chai.request(url)
      .post('/signup')
      .send(testUser)
      .end(function(err, res) {
        this.token = JSON.parse(res.text).token;
        expect(err).to.eql(null);
        done();
    }.bind(this));
  });

  after(function(done) {
    mongoose.connection.db.dropDatabase(function() {
      done();
    });
  });

  describe('the songs routes', function() {
    it('should be able to create a song', function(done) {
      var songData = {name: 'test song', token: this.token};
      chai.request(url)
      .post('/savesong')
      .send(songData)
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.name).to.eql('test song');
        expect(res.body).to.have.property('_id');
        done();
      });
    });

  it('should be able to retrieve listed songs', function(done) {
    chai.request(url)
    .get('/allsongs')
    .end(function(err, res) {
    expect(err).to.eql(null);
    expect(Array.isArray(res.body)).to.eql(true);
    done();
    });
  });
});

  describe('routes that have a song already registered', function() {
    beforeEach(function(done) {
      (new Song({chords: ['C','F','G','C'], token: this.token}))
      .save(function(err, data) {
        expect(err).to.eql(null);
        this.song = data;
        done();
      }.bind(this));
    });

    it('should be able to delete a song', function(done) {
      chai.request(url)
      .delete('/songs/' + this.song._id)
      .send({token: this.token})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.body.msg).to.eql('Song Deleted');
        done();
      });
    });

    it('should disallow unauthorized deletions', function(done) {
      chai.request(url)
      .delete('/songs/' + this.song._id)
      .send({token: 'random token'})
      .end(function(err, res) {
        expect(err).to.eql(null);
        expect(res.error.text).to.eql('{"msg":"not allowed"}');
        done();
      });
    });
  });
});
