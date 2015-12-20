module.exports = function(app) {
  app.directive('songDirective', function() {
    return {
      restrict: 'AC',
      templateUrl: '/templates/song_directive_template.html',
      scope: {
        song: '=',
      }
    }
  });
};
