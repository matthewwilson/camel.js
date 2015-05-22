var should = require('chai').should();
var camel = require('../../index.js');
var fs = require('fs');
var path = require('path');
var watch = require('watch');

describe('watch Dir Test', function() {

  before(function(done) {
    fs.mkdir(path.join('test','integration','sourceFiles1'), function(err) {
      fs.mkdir(path.join('test','integration','destinationFiles1'), function(err) {
        done(err);
      });
    });

  });

  after(function() {
    watch.unwatchTree('test/integration/destinationFiles');
    deleteFolderRecursive(path.join('test','integration','sourceFiles1'));
    deleteFolderRecursive(path.join('test','integration','destinationFiles1'));
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

  it('Waits for files to be added then copies the files in source files to destinationFiles', function(done) {

    this.timeout(20000);

    var context = new camel.context();
    var route = new camel.route();
    route.id = Math.floor((Math.random() * 1000000) + 1);
    route.from('file://test/integration/sourceFiles1?watch=true').to('file://test/integration/destinationFiles1');
    context.addRoute(route);

    context.start();

    var count = 0;

    watch.watchTree('test/integration/destinationFiles1', function (f, curr, prev) {
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

    createFiles();
  });

  function createFiles() {
      fs.writeFile(path.join('test','integration','sourceFiles1','source1.txt'), "Hey there! source1", function(err) {

        fs.writeFile(path.join('test','integration','sourceFiles1','source2.txt'), "Hey there! source2", function(err) {

          fs.writeFile(path.join('test','integration','sourceFiles1','source3.txt'), "Hey there! source3", function(err) {

            fs.writeFile(path.join('test','integration','sourceFiles1','source4.txt'), "Hey there! source4", function(err) {

              fs.writeFile(path.join('test','integration','sourceFiles1','source5.txt'), "Hey there! source5", function(err) {

              });

            });

          });

        });
    });
  }

});
