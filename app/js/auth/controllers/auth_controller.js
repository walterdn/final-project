module.exports = function(app) {
  app.controller('AuthController', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
    
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

    $scope.songLoader = function(song) {
      if(song) $scope.loadThisSong = song;
      else return $scope.loadThisSong;
    };
  }]);
};
