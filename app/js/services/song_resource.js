var handleSuccess = function(callback) {
  return function(res) {
    callback(null, res.data);
  };
};

var handleFail = function(callback) {
  return function(res) {
    callback(res.data);
  }
};

module.exports = function(app) {
  app.factory('songResource', ['$http', function($http) {
    return function(resourceName) {
      var resource = {}
      resource.getAll =  function(callback) {
        $http.get('/api/' + resourceName)
          .then(handleSuccess(callback), handleFail(callback));

      };

      resource.create = function(data, callback) {
        $http.post('/api/' + resourceName, data)
          .then(handleSuccess(callback), handleFail(callback));
      };
      return resource;
    };
  }]);
};
