var angular = window.angular;

module.exports = function(app) {
  app.controller('SavedSongsController', ['$scope', '$http', '$location', function($scope, $http, $location) {
    $scope.songs = [];

    $scope.getAll = function() {
      $http.get('/api/allsongs')
        .then(function(res) {
          $scope.songs = res.data;
        }, function(err) {
          console.log(err.data);
        });
    };
    
    $scope.remove = function(song) { 
      if (($scope.currentUser != song.composer) && ($scope.currentUser != 'walter')) {
        alert('Denied. You can only delete your own songs.');
      } else {
      $scope.songs.splice($scope.songs.indexOf(song), 1);
      $http.delete('/api/songs/' + song._id)
        .then(function(res) {
          console.log('song deleted');
        }, function(err) {
          console.log(err.data);
          $scope.errors.push('could not delete song');
          $scope.getAll();
        });
      }
    };

    $scope.loadSong = function(song) {
      $scope.songLoader(song);
      $location.path('/songs');
    };

    $scope.backToLogin = function() {
      $location.path('/signin');
    };

  }]);
};
