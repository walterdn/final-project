require('./../../app/js/client');
require('angular-mocks');

describe('the music controller', function() {
  var $httpBackend;
  var $ControllerConstructor;
  var $scope;
  $scope.context = new AudioContext();

  beforeEach(angular.mock.module('SongWriterApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $ControllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    var controller = $ControllerConstructor('MusicController', {$scope: $scope});
    expect(typeof $scope).toBe('object');
    expect(typeof controller).toBe('object');
    expect(Array.isArray($scope.songs)).toBe(true);
  });
});
