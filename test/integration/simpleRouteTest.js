var should = require('chai').should();
var camel = require('../../index.js');
var fs = require('fs');
var path = require('path');

describe('Simple Route Test', function() {

  before(function(done) {
    fs.writeFile(path.join('test','integration','source.txt'), "Hey there!", done);
  });

  after(function(done) {
    fs.unlink(path.join('test','integration','source.txt'), function(err) {
      fs.unlink(path.join('test','integration','destination.txt'), done);
    });
  });

  it('Copies the source.txt file to destination.txt', function(done) {

    var context = new camel.context();
    var route = new camel.route();
    route.from('file://test/integration/source.txt').to('file://test/integration/destination.txt');
    context.addRoute(route);

    context.start(function(err) {

      if(err) {
        done(err);
      }

      fs.readFile('test/integration/destination.txt', function(err, data) {

        if(err) {
          done(err);
        }

        var content = data.toString();

        content.should.equal('Hey there!');
        done();

      });

    });

  });

});
