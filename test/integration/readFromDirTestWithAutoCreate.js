var should = require('chai').should();
var camel = require('../../index.js');
var fs = require('fs');
var path = require('path');

describe('Simple Read From Dir Test with auto create', function() {

  after(function() {
    deleteFolderRecursive(path.join('test','integration','createSourceFiles'));
    deleteFolderRecursive(path.join('test','integration','createDestinationFiles'));
  });

  var deleteFolderRecursive = function(dirPath) {
    if( fs.existsSync(dirPath) ) {
      fs.readdirSync(dirPath).forEach(function(file,index){
        var curPath = path.join(dirPath, file);
        if(fs.lstatSync(curPath).isDirectory()) { // recurse
          deleteFolderRecursive(curPath);
        } else { // delete file
          fs.unlinkSync(curPath);
        }
      });
      fs.rmdirSync(dirPath);
    }
  };

  it('Creates the sourcefiles directory and destinationfiles directory', function(done) {

    var context = new camel.context();
    var route = new camel.route();
    route.id = Math.floor((Math.random() * 1000000) + 1);
    route.from('file://test/integration/createSourceFiles?autoCreate=true').to('file://test/integration/createDestinationFiles?autoCreate=true');
    context.addRoute(route);

    context.start(function(err) {

      if(err) {
        done(err);
      } else {
        fs.accessSync(path.join('test','integration','createSourceFiles'));
        fs.accessSync(path.join('test','integration','createDestinationFiles'));
        done();
      }


    });



  });

});
