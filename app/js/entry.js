require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');
var angular = window.angular;
var BufferLoader = require('./buffer-loader');

var songWriterApp = angular.module('SongWriterApp', ['ngRoute', 'ngCookies', 'base64', 'ngDraggable']);
require('./client')(songWriterApp);
require('./auth/auth')(songWriterApp);
require('./songs/saved_songs_controller')(songWriterApp);

songWriterApp.config(['$routeProvider', function($route) {
  $route
    .when('/songs', {
      templateUrl: '/templates/musical_view.html',
      controller: 'MusicController'
    })
    .when('/signup', {
      templateUrl: '/templates/auth_view.html',
      controller: 'SignupController'
    })
    .when('/signin', {
      templateUrl: '/templates/auth_view.html',
      controller: 'SigninController'
    })
    .when('/savedsongs', {
      templateUrl: '/templates/saved_songs.html',
      controller: 'SavedSongsController'
    })
    .otherwise({
      redirectTo: '/signin'
    })
}]);
