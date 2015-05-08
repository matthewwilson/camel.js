var should = require('chai').should();
var fileComponent = require('../../../modules/components/fileComponent.js');
var camel = require('../../../index.js');
var fs = require('fs');


exports.describe = function() {

  var originalfs;

  beforeEach(function(){
    originalfs = fs;

    fs.stat = function (path, callback) {

      var stats = {};
      stats.isDirectory = function () {
        return false;
      };

      callback(undefined, stats);

    };

  });

  afterEach(function(){
    fs = originalfs;
  });


  it('reads a file, puts the contents of the file in the body and performs the callback', function() {

    fs.readFile = function (fileName, callback) {
      fileName.should.be.a('string');
      fileName.should.equal('source.txt');
      callback(undefined, new Buffer('Heres the body text laaad!'));
    };

    var route = new camel.route();
    route.from("file://source.txt").to('file://destination.txt');


    fileComponent.from(route.getNextEndpoint(), route, function (err, route) {

      (err === undefined).should.be.true;

      route.body.toString().should.equal('Heres the body text laaad!');
      route.getNextEndpoint().should.equal('file://destination.txt');
    });

    route.queue.length.should.equal(0);

  });

  it('reads a file, the file is empty, and performs the callback with an undefined body', function() {

    fs.readFile = function (fileName, callback) {
      fileName.should.be.a('string');
      fileName.should.equal('source.txt');
      callback(undefined, undefined);
    };

    var route = new camel.route();
    route.from("file://source.txt").to('file://destination.txt');

    fileComponent.from(route.getNextEndpoint(), route, function (err, route) {

      (err === undefined).should.be.true;

      (route.body === undefined).should.be.true;
      route.getNextEndpoint().should.equal('file://destination.txt');

    });

    route.queue.length.should.equal(0);

  });

  it('calls the callback function with an error if the file is not found', function() {

    fs.readFile = function (fileName, callback) {
      callback(new Error("File not found"), undefined);
    };

    var route = new camel.route();
    route.from('file://source.txt').to('file://destination.txt');

    fileComponent.from(route.getNextEndpoint(), route, function (err, route) {
      err.should.not.be.undefined;
      route.should.not.be.undefined;
    });

    route.queue.length.should.equal(1);

  });

  it('returns an error if the filename is not found', function() {

    var route = new camel.route();
    route.from("file://source.txt").to('file://destination.txt');
    route.getNextEndpoint();

    fileComponent.from("file://", route, function (err, route) {
      err.should.not.be.undefined;
      err.message.should.equal('No path found in endpoint: file://');

      route.should.not.be.undefined;
      route.getNextEndpoint().should.equal('file://destination.txt');
    });

    route.queue.length.should.equal(0);

  });

  it('returns an error if the filename is not found', function() {

    var route = new camel.route();
    route.from("file://source.txt").to('file://destination.txt');
    route.getNextEndpoint();

    fileComponent.from("file://", route, function (err, route) {
      err.should.not.be.undefined;
      err.message.should.equal('No path found in endpoint: file://');

      route.should.not.be.undefined;
      route.getNextEndpoint().should.equal('file://destination.txt');
    });

    route.queue.length.should.equal(0);

  });

  it('processes all files in a directory if no filename is specified', function() {


    fs.stat = function (path, callback) {

      var stats = {};

      if(path == 'directoryPathHere') {

        stats.isDirectory = function () {
          return true;
        };

      } else if(path == 'hello.txt') {

        stats.isDirectory = function () {
          return false;
        };

      } else {
        should.fail('Failing test because path '+path+' was not expected');
      }

      callback(undefined, stats);

    };

    var expectedFileNames = ['hello.txt', 'world.txt'];

    fs.readFile = function (fileName, callback) {
      fileName.should.be.a('string');
      fileName.should.equal(expectedFileNames.shift());

      if(fileName == 'hello.txt') {
        callback(undefined, 'hello');
      } else if(fileName == 'world.txt') {
        callback(undefined, 'world');
      } else {
        should.fail('Failing test because filename '+fileName+' was not expected');
      }

    };

    fs.readdir = function (path, callback) {

      if(path == 'directoryPathHere') {
        callback(undefined, ['hello.txt', 'world.txt']);
      } else {
        should.fail('Failing test because path '+path+' was not expected');
      }

    };

    var expectedBodies = ['hello', 'world'];

    var camelroute = new camel.route();

    camelroute.from('file://directoryPathHere').to('file://hello.txt');

    fileComponent.from(camelroute.getNextEndpoint(), camelroute, function (err, route) {

      expectedBodies.shift().should.equal(route.body);
      route.getNextEndpoint().should.equal('file://hello.txt');

    });

    expectedBodies.length.should.equal(0);

  });

};
