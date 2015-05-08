var should = require('chai').should();
var fileComponent = require('../../../modules/components/fileComponent.js');
var camel = require('../../../index.js');
var fs = require('fs');


exports.describe = function() {

  var originalReadFile;

  beforeEach(function(){
    originalReadFile = fs.readFile;
  });

  afterEach(function(){
    fs.readFile = originalReadFile;
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

  });

  it('returns an error if the filename is not found', function() {

    var route = new camel.route();
    route.from("file://source.txt").to('file://destination.txt');
    route.getNextEndpoint();

    fileComponent.from("file://", route, function (err, route) {
      err.should.not.be.undefined;
      err.message.should.equal('No fileName found in endpoint: file://');

      route.should.not.be.undefined;
      route.getNextEndpoint().should.equal('file://destination.txt');
    });

  });

};
