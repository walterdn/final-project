var angular = window.angular;

module.exports = function(app) {
  app.controller('SongsController', ['$scope', '$http', 'cfResource', '$location', function($scope, $http, cfResource, $location) {
    $scope.songs = [];
    $scope.errors = [];
    $scope.newSong = {};
    var songsResource = cfResource('songs');

    if (!$scope.token)
      $location.path('/signup');

    $scope.getAll = function() {
      songsResource.getAll(function(err, data) {
        if (err) return err;

        $scope.songs = data;
      });
    };

    $scope.create = function(song) {
      songsResource.create(song, function(err, data){
        if (err) return err;
        $scope.songs.push(data);
        $scope.newSong = {};
      });
    };

    $scope.create = function(song) {
      $http.post('/api/savesong', song)
    }

    $scope.update = function(song) {
      song.editing = false;
      $http.put('/api/songs/' + song._id, song)
        .then(function(res) {
          console.log('song updated');
        }, function(err) {
          $scope.errors.push('could not get song');
          console.log(err.data);
        });
    };

    $scope.remove = function(song) {
      $scope.songs.splice($scope.songs.indexOf(song), 1);
      $http.delete('/api/songs/' + song._id)
        .then(function(res) {
          console.log('song deleted');
        }, function(err) {
          console.log(err.data);
          $scope.errors.push('could not delete song');
          $scope.getAll();
        });
    };
  }]);
};
