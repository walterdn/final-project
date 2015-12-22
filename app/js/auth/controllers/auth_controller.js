module.exports = function(app) {
  app.controller('AuthController', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
    
    $scope.logOut = function() {
      $scope.token = null;
      $scope.currentUser = null;
      $cookies.remove('token');
      $location.path('/signin');
    };
    
    $scope.getUser = function() {
      $scope.token = $cookies.get('token');
      $http.defaults.headers.common.token = $scope.token;
      $http.get('/api/users')
      .then(function(res) {
        $scope.currentUser = res.data.username;
      }, function(err) {
        console.log(err);
      });
    };

    $scope.songLoader = function(song) { //gets set in save_songs_controller from the /savesongs view, and then called from in client.js from /songs view
      if (song == 'clearSongLoader') $scope.loadThisSong = null;
      if (song) $scope.loadThisSong = song;
      else return $scope.loadThisSong;
    };
  }]);
};
