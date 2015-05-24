var should = require('chai').should();
var camel = require('../../index.js');
var fs = require('fs');
var path = require('path');

describe('Watch Dir test with existing files', function() {

  before(function(done) {
    fs.mkdir(path.join('test','integration','sourceFiles'), function(err) {

      if(err) { done(err); }

        fs.writeFile(path.join('test','integration','sourceFiles','source1.txt'), "Hey there! source1", function(err) {

          if(err) { done(err); }

          fs.writeFile(path.join('test','integration','sourceFiles','source2.txt'), "Hey there! source2", function(err) {

            if(err) { done(err); }

            fs.writeFile(path.join('test','integration','sourceFiles','source3.txt'), "Hey there! source3", function(err) {

              if(err) { done(err); }

              fs.writeFile(path.join('test','integration','sourceFiles','source4.txt'), "Hey there! source4", function(err) {

                if(err) { done(err); }

                fs.writeFile(path.join('test','integration','sourceFiles','source5.txt'), "Hey there! source5", function(err) {

                  if(err) { done(err); }

                  fs.mkdir(path.join('test','integration','destinationFiles'), done);

                });

              });

            });

          });

        });

    });

  });

  after(function() {
    deleteFolderRecursive(path.join('test','integration','sourceFiles'));
    deleteFolderRecursive(path.join('test','integration','destinationFiles'));
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

  it('Copies the files in source files to destinationFiles', function(done) {

    var context = new camel.context();
    var route = new camel.route();
    route.id = Math.floor((Math.random() * 1000000) + 1);
    route.from('file://test/integration/sourceFiles?watch').to('file://test/integration/destinationFiles');
    context.addRoute(route);

    context.start(function(err) {

      if(err) {
        done(err);
      }

      fs.readdir(path.join('test','integration','destinationFiles'), function(err, files) {

        if(err) {
          done(err);
        }

        files.length.should.equal(5);

        for(i = 0; i<files.length; i++) {

          var fileName = files[i];
          var contents = fs.readFileSync(path.join('test','integration','destinationFiles',fileName)).toString();

          contents.should.equal("Hey there! "+fileName.replace(".txt",""));

        }

        done();

      });

    });

  });

});
