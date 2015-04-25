var fs = require('fs');

module.exports = function() {

  this.isFileEndpoint = function(uri) {
    if(uri) {
      return (uri.indexOf('file://') === 0);
    }

    return false;

  };

  this.stripUriScheme = function(uri) {
    if(uri.indexOf('file://') === 0) {
      return uri.replace('file://','');
    }

    return uri;
  };

  this.from = function(uri, route,  callback) {

    var fileName = this.stripUriScheme(uri);

    fs.readFile(fileName, function (err, data) {

      if(err) throw err;

      route.body = data;

      console.log(route.body);

      callback(route);

    });

  };

  this.to = function(uri, route, callback) {

    var fileName = this.stripUriScheme(uri);

    fs.writeFile(fileName, route.body, function(err) {
        if(err) {
            return console.log(err);
        }

        callback(route);
    });

  };

};
