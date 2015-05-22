var fs = require('fs');
var p = require('path');
var minimatch = require("minimatch");
var mkdirp = require('mkdirp');

function isFileEndpoint(uri) {

  if(uri) {
    return (uri.protocol === 'file:');
  }

  return false;

}

exports.isFileEndpoint = isFileEndpoint;

function readFile(path, route, callback) {

  fs.readFile(path, function (err, data) {

    if(err) {
      callback(err, route);
    } else {
      route.message.body = data;
      callback(undefined, route);
    }

  });

}


exports.from = function(uri, route, callback) {

  var path = uri.hostname;

  if(!path) {
    callback(new Error('No path found in endpoint: '+uri.href), route);
  } else {

    route.message.headers.filePath = path;

    if(uri.hasOptions() && uri.options.autoCreate) {

      mkdirp(path, function (err) {

        if (err) {
          callback(err, route);
        }
        else {
          processFromEndpoint(path, uri, route, callback);
        }

      });

    } else {
      processFromEndpoint(path, uri, route, callback);
    }
  }
};

function processFromEndpoint(path, uri, route, callback) {
  fs.stat(path, function(err, stats) {

    if(err) {
      callback(err, route);
    } else {

      if(stats.isDirectory()) {

        fs.readdir(path, function(err, files) {

          if(err) {
            callback(err, route);
          } else {

            if(!uri.hasOptions()) {
              processFiles(files, route, path, callback);
            } else {

              var filesToProcess = files;

              if(uri.options.fileFilter) {
                filesToProcess = files.filter(minimatch.filter(uri.options.fileFilter, {matchBase:true}));
              }

              processFiles(filesToProcess, route, path, callback);
            }

          }

        });

      } else {
        readFile(path, route, callback);
      }
    }

  });

}

function processFiles(files, route, path, callback) {
  var fileCount = 1;
  files.forEach(function (file) {
    route.message.headers.filePath = file;

    if(fileCount == files.length) {
      readFile(p.join(path, file), route, callback);
    } else {
      readFile(p.join(path, file), route.clone(), callback);
      fileCount++;
    }

  });

  if(!files || files.length === 0) {
    callback(null, route);
  }

}

exports.to = function(uri, route, callback) {

  var path = uri.hostname;

  if(!path) {
    callback(new Error('No path found in endpoint: '+uri.href), route);
  }

  if(uri.hasOptions() && uri.options.autoCreate) {

    mkdirp(path, function (err) {

      if (err) {
        callback(err, route);
      }
      else if(route.message !== undefined && route.message.body !== undefined) {
        processToEndpoint(path, route, callback);
      } else {
        callback(null, route);
      }

    });

  }
  else if(route.message === undefined || route.message.body === undefined) {
    callback(new Error("The body cannot be empty when writing to file"), route);
  }
  else {
    processToEndpoint(path, route, callback);
  }


};

function processToEndpoint(path, route, callback) {
  fs.access(path, function(err) {

    if(err) {
      writeFile(path, route, callback);
    } else {

      fs.stat(path, function(err, stats) {

        if(err) {
          callback(err, route);
        } else {

          if(stats.isDirectory()) {
            writeFile(p.join(path, route.message.headers.filePath), route, callback);
          } else {
            writeFile(path, route, callback);
          }
        }

      });
    }

  });
}

function writeFile(filePath, route, callback) {
  fs.writeFile(filePath, route.message.body, function(err) {
    if(err) {
      callback(err, route);
    } else {
      callback(undefined, route);
    }
  });
}
