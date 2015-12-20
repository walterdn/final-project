require('/../../app/js/entry');
require('angular-mocks');

describe('songs controller', function() {
  var $httpBackend;
  var $ControllerConstructor;
  var $scope;

  beforeEach(angular.mock.module('SongWriterApp'));

  beforeEach(angular.mock.inject(function($rootScope, $controller) {
    $scope = $rootScope.$new();
    $ControllerConstructor = $controller;
  }));

  it('should be able to create a controller', function() {
    var controller = $ControllerConstructor('SongsController', {$scope: $scope});
    expect(typeof $scope).toBe('object');
    expect(typeof controller).toBe('object');
    expect(Array.isArray($scope.songs)).toBe(true);
  });

  describe('REST request functions', function() {
    beforeEach(angular.mock.inject(function(_$httpBackend_, $rootScope) {
      $httpBackend = _$httpBackend_;
      $scope = $rootScope.$new();
      $ControllerConstructor('SongsController', {$scope: $scope});
    }));

    afterEach(function() {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should add an array to songs with a GET all', function() {
      $httpBackend.expectGET('/api/songs').respond(200, [{_id: 1, name: 'test song'}]);
      $scope.getAll();
      $httpBackend.flush();
      expect($scope.songs[0].name).toBe('test song');
    });

    it('should be able to create a new song', function() {
      $httpBackend.expectPOST('/api/songs', {name: 'test song', chords: ['C','E','G']}).respond(200, {name: 'a different song'});
      expect($scope.songs.length).toBe(0);
      expect($scope.newSong).toEqual($scope.defaults);
      $scope.newSong.name = 'test song';
      $scope.create($scope.newBear);
      $httpBackend.flush();
      expect($scope.songs[0].name).toBe('a different song');
      expect($scope.newSong).toEqual($scope.defaults);
    });
  });
});
