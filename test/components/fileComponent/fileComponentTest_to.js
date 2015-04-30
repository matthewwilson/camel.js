var should = require('chai').should();
var fileComponent = require('../../../modules/components/fileComponent.js');
var camel = require('../../../index.js');
var fs = require('fs');



exports.describe = function() {

  it('writes the contents of the body, to the specified filename in the endpoint', function() {

    var originalWriteFile = fs.writeFile;

    fs.writeFile = function (fileName, body, callback) {
      fileName.should.be.a('string');
      fileName.should.equal('destination.txt');

      body.toString().should.equal('Here is the content');

      callback(undefined);
    };

    var route = new camel.route();

    route.body = new Buffer('Here is the content');

    fileComponent.to("file://destination.txt", route, function (err, route) {

      (err === undefined).should.be.true;

      route.body.toString().should.equal('Here is the content');
      (route.getNextEndpoint() === undefined).should.be.true;
    });

    fs.writeFile = originalWriteFile;

  });

  it('throws an error if the body is undefined', function() {

    var route = new camel.route();

    fileComponent.to("file://destination.txt", route, function (err, route) {

      err.should.not.be.undefined;
      err.message.should.equal('The body cannot be empty when writing to file');
      route.should.not.be.undefined;

    });

  });

  it('calls the callback with an error if unable to write to file', function() {

    var originalWriteFile = fs.writeFile;

    fs.writeFile = function (fileName, body, callback) {
      fileName.should.be.a('string');
      fileName.should.equal('destination.txt');

      body.toString().should.equal('Here is the content');

      callback(new Error('Unable to write to file'));
    };

    var route = new camel.route();

    route.body = new Buffer('Here is the content');

    fileComponent.to("file://destination.txt", route, function (err, route) {

      err.should.not.be.undefined;
      err.message.should.equal('Unable to write to file');

      route.body.toString().should.equal('Here is the content');
      (route.getNextEndpoint() === undefined).should.be.true;
    });

    fs.writeFile = originalWriteFile;

  });

  it('returns an error if the filename is not found', function() {

    var route = new camel.route();
    route.to('file://destination.txt');

    route.body = new Buffer("Hello World");

    fileComponent.to("file://", route, function (err, route) {
      err.should.not.be.undefined;
      err.message.should.equal('No fileName found in endpoint: file://');

      route.should.not.be.undefined;
      route.getNextEndpoint().should.equal('file://destination.txt');
    });


  });


};
