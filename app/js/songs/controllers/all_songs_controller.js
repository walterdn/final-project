module.exports = function(app) {
  app.controller('AllSongsController', ['$scope', '$http', function($scope, $http) {
    $http.get('/api/allsongs')
      .then(function(res) {
        $scope.songs = res.data;
      }, function(err) {
        console.log(err);
      });
  }]);
};
