var should = require('chai').should();
var camel = require('../../index.js');
var fs = require('fs');
var path = require('path');
var watch = require('watch');

describe('watch Dir Test with two routes', function() {

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

                  fs.mkdir(path.join('test','integration','destinationFiles'), function(err) {

                    fs.mkdir(path.join('test','integration','anotherDestinationFiles'), done);

                  });

                });

              });

            });

          });

        });

    });


  });

  after(function() {
    watch.unwatchTree('test/integration/destinationFiles');
    deleteFolderRecursive(path.join('test','integration','sourceFiles'));
    deleteFolderRecursive(path.join('test','integration','destinationFiles'));
    deleteFolderRecursive(path.join('test','integration','anotherDestinationFiles'));
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

  it('Waits for files to be copied by one route then copies to a different destination folder', function(done) {

    this.timeout(20000);

    var context = new camel.context();
    var route = new camel.route();
    route.id = Math.floor((Math.random() * 1000000) + 1);
    route.from('file://test/integration/sourceFiles').to('file://test/integration/destinationFiles');
    context.addRoute(route);

    var route2 = new camel.route();
    route2.id = Math.floor((Math.random() * 1000000) + 1);
    route2.from('file://test/integration/destinationFiles?watch=true').to('file://test/integration/anotherDestinationFiles');
    context.addRoute(route2);

    context.start(function(err) {

    });

    var count = 0;

    watch.watchTree('test/integration/anotherDestinationFiles', function (f, curr, prev) {
      if (typeof f == "object" && prev === null && curr === null) {
        // Finished walking the tree
      } else if (prev === null) {
        count++;
        var contents = fs.readFileSync(f).toString();
        contents.should.equal("Hey there! "+path.basename(f).replace(".txt",""));
        if(count == 5) {
          done();
        }
      }
    });

  });

});
