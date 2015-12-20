var angular = window.angular;

module.exports = function(app) {
  app.controller('SavedSongsController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.songs = [];

    if (!$scope.token) $location.path('/signup');

    $scope.getAll = function() {
      $http.get('/api/allsongs')
        .then(function(res) {
          $scope.songs = res.data;
        }, function(err) {
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

    $scope.loadSong = function(song) {
      $scope.songLoader(song);
      $location.path('/songs');
    };

  }]);
};
