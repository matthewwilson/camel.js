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

    if(!fileName) {
      callback(new Error('No fileName found in endpoint: '+uri), route);
    } else {

      fs.readFile(fileName, function (err, data) {

        if(err) {
          callback(err, route);
        } else {
          route.body = data;
          callback(undefined, route);
        }

      });

    }
  };

  this.to = function(uri, route, callback) {

    var fileName = this.stripUriScheme(uri);

    if(!fileName) {
      callback(new Error('No fileName found in endpoint: '+uri), route);
    } else if(route.body === undefined) {
      callback(new Error("The body cannot be empty when writing to file"), route);
    } else {

      fs.writeFile(fileName, route.body, function(err) {
        if(err) {
          callback(err, route);
        } else {
          callback(undefined, route);
        }
      });
    }
  };

};
