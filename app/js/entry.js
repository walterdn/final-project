require('angular/angular');
require('angular-route');
require('angular-cookies');
require('angular-base64');
var angular = window.angular;
var BufferLoader = require('./buffer-loader');

var songWriterApp = angular.module('SongWriterApp', ['ngRoute', 'ngCookies', 'base64', 'ngDraggable']);
require('./services/services')(songWriterApp);
require('./controllers/controllers')(songWriterApp);
require('./directives/directives')(songWriterApp);
require('./client')(songWriterApp);

require('./songs/songs')(songWriterApp);
require('./auth/auth')(songWriterApp);

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
    .when('/allsongs', {
      templateUrl: '/templates/all_songs.html',
      controller: 'AllSongsController'
    })
    .otherwise({
      redirectTo: '/signin'
    })
}]);
