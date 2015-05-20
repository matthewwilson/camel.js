var should = require('chai').should();
var fileComponent = require('../../../../modules/components/fileComponent.js');
var camel = require('../../../../index.js');
var fs = require('fs');
var path = require('path');
var endpoint = require('../../../../modules/endpoint.js');

exports.describe = function() {

  it('writes the contents of the body, to the specified filename in the endpoint', function() {

    fs.writeFile = function (fileName, body, callback) {
      fileName.should.be.a('string');
      fileName.should.equal('destination.txt');

      body.toString().should.equal('Here is the content');

      callback(undefined);
    };

    var route = new camel.route();
    route.message.body = new Buffer('Here is the content');

    fileComponent.to(new endpoint("file://destination.txt"), route, function (err, route) {

      (err === undefined).should.be.true;

      route.message.body.toString().should.equal('Here is the content');
      (route.getNextEndpoint() === undefined).should.be.true;
    });

  });

  it('throws an error if the body is undefined', function() {

    var route = new camel.route();

    fileComponent.to(new endpoint("file://destination.txt"), route, function (err, route) {

      err.should.not.be.undefined;
      err.message.should.equal('The body cannot be empty when writing to file');
      route.should.not.be.undefined;

    });

  });

  it('calls the callback with an error if unable to write to file', function() {

    fs.writeFile = function (fileName, body, callback) {
      fileName.should.be.a('string');
      fileName.should.equal('destination.txt');

      body.toString().should.equal('Here is the content');

      callback(new Error('Unable to write to file'));
    };

    var route = new camel.route();
    route.message.body = new Buffer('Here is the content');

    fileComponent.to(new endpoint("file://destination.txt"), route, function (err, route) {

      err.should.not.be.undefined;
      err.message.should.equal('Unable to write to file');

      route.message.body.toString().should.equal('Here is the content');
      (route.getNextEndpoint() === undefined).should.be.true;
    });

  });

  it('returns an error if the filename is not found', function() {

    var route = new camel.route();
    route.from("file://source.txt").to('file://destination.txt');
    route.getNextEndpoint();

    route.message.body = new Buffer("Hello World");

    fileComponent.to(new endpoint("file://"), route, function (err, route) {
      err.should.not.be.undefined;
      err.message.should.equal('No path found in endpoint: file://');

      route.should.not.be.undefined;
      route.getNextEndpoint().href.should.equal('file://destination.txt');
    });


  });

  it('writes file to a directory if no filefilter is specified', function() {

    fs.stat = function (path, callback) {

      var stats = {};

      stats.isDirectory = function () {
        return true;
      };

      callback(undefined, stats);

    };

    fs.writeFile = function (fileName, body, callback) {
      fileName.should.be.a('string');
      fileName.should.equal(path.join('destinationFiles', 'source.txt'));

      body.toString().should.equal('Hello World');

      callback(undefined);
    };

    var route = new camel.route();
    route.from('file://sourceFiles').to('file://destinationFiles');
    route.getNextEndpoint();

    route.message.headers.filePath = "source.txt";
    route.message.body = new Buffer("Hello World");

    fileComponent.to(route.getNextEndpoint(), route, function (err, route) {

      route.queue.length.should.equal(0);

    });

  });


};
