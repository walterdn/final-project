module.exports = function(app) {
  app.controller('SignupController', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {
    $scope.headingText = 'Sign up to create sweet jams';
    $scope.buttonText = 'Sign up';
    $scope.userRelation = 'Have an Account?'
    $scope.authenticate = function(user) {
      $http.post('/api/signup', user)
        .then(function(res){
          $cookies.put('token', res.data.token);
          $scope.getUser();
          $location.path('/songs');
        }, function(err) {
          console.log(err.data);
        });
    };

    $scope.changePlaces = function() {
      $location.path('/signin');
    };
    $scope.makeSong = function() {
      $location.path('/songs');
    };
    $scope.viewSongs = function() {
      $location.path('/savedsongs');
    };
  }]);
};
