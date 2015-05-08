var fs = require('fs');

var isFileEndpoint = function(uri) {
  if(uri) {
    return (uri.indexOf('file://') === 0);
  }

  return false;

};

exports.isFileEndpoint = isFileEndpoint;

var stripUriScheme = function(uri) {
  if(uri.indexOf('file://') === 0) {
    return uri.replace('file://','');
  }

  return uri;
};

exports.stripUriScheme = stripUriScheme;

var readFile = function(path, route, callback) {

  fs.readFile(path, function (err, data) {

    if(err) {
      callback(err, route);
    } else {
      route.body = data;
      callback(undefined, route);
    }

  });

};

exports.from = function(uri, route,  callback) {

  var path = stripUriScheme(uri);

  if(!path) {
    callback(new Error('No path found in endpoint: '+uri), route);
  } else {

    fs.stat(path, function(err, stats) {

      if(stats.isDirectory()) {

        fs.readdir(path, function(err, files) {

          files.forEach(function (file) {

            readFile(file, route.clone(), callback);

          });

        });

      } else {

        readFile(path, route, callback);

      }

    });

  }
};

exports.to = function(uri, route, callback) {

  var fileName = stripUriScheme(uri);

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
