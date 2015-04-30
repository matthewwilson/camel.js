var should = require('chai').should();
var fileComponent = require('../../../modules/components/fileComponent.js');
var camel = require('../../../index.js');
var routeProcessor = require('../../../modules/processors/routeProcessor.js');

describe('routeProcessor', function(){
  describe('#process', function() {

    var originalFileComponent;

    beforeEach(function(){
      originalFileComponent = fileComponent;
    });

    afterEach(function(){
      fileComponent = originalFileComponent;
    });

    it('A route with 2 endpoints is successfully processed', function() {

      fileComponent.from = function (endpoint, route, callback) {

        endpoint.should.equal('file://source.txt');

        route.body = new Buffer('hello world');

        route.hasStarted.should.equal(true);

        callback(undefined, route);

      };

      fileComponent.to = function (endpoint, route, callback) {

        endpoint.should.equal('file://destination.txt');

        route.body.toString().should.equal('hello world');

        route.hasStarted.should.equal(true);

        callback(undefined, route);

      };

      var route = new camel.route();
      route.from('file://source.txt')
           .to('file://destination.txt');

      routeProcessor.process(route);

    });

    it('A route with 4 endpoints is successfully processed', function() {

      fileComponent.from = function (endpoint, route, callback) {

        endpoint.should.equal('file://source.txt');

        route.body = new Buffer('hello world');

        route.hasStarted.should.equal(true);

        callback(undefined, route);

      };

      var expectedEndpointNames = ['file://destination.txt', 'file://destination2.txt', 'file://destination3.txt'];

      fileComponent.to = function (endpoint, route, callback) {

        endpoint.should.equal(expectedEndpointNames.shift());

        route.body.toString().should.equal('hello world');

        route.hasStarted.should.equal(true);

        callback(undefined, route);

      };

      var route = new camel.route();
      route.from('file://source.txt')
           .to('file://destination.txt')
           .to('file://destination2.txt')
           .to('file://destination3.txt');

      routeProcessor.process(route);

      expectedEndpointNames.length.should.equal(0);

    });

    it('A route with 4 endpoints fails to read the file, the other endpoints are not processed', function() {

      var error = new Error('File not found or something');

      fileComponent.from = function (endpoint, route, callback) {

        endpoint.should.equal('file://source.txt');

        route.hasStarted.should.equal(true);

        callback(error, route);

      };

      fileComponent.to = function (endpoint, route, callback) {

        should.fail('The to function should not be called.');

      };

      var route = new camel.route();
      route.from('file://source.txt')
           .to('file://destination.txt')
           .to('file://destination2.txt')
           .to('file://destination3.txt');

      (function(){routeProcessor.process(route);}).should.throw(error);

    });

    it('A route with 4 endpoints fails to write a file, the remaining endpoints are not processed', function() {

      var error = new Error('Could not write to file for some reason');

      fileComponent.from = function (endpoint, route, callback) {

        endpoint.should.equal('file://source.txt');

        route.body = new Buffer("Body loaded from file");

        route.hasStarted.should.equal(true);

        callback(null, route);

      };

      var expectedEndpointNames = ['file://destination.txt', 'file://destination2.txt'];

      fileComponent.to = function (endpoint, route, callback) {

        route.hasStarted.should.equal(true);

        var expectedEndpointName = expectedEndpointNames.shift();

        if(expectedEndpointName) {
          endpoint.should.equal(expectedEndpointName);
        } else {
          should.fail('The to function should not be called for the last endpoint');
        }

        if(endpoint == "file://destination2.txt") {
          callback(error, route);
        } else {
          callback(null, route);
        }

      };

      var route = new camel.route();
      route.from('file://source.txt')
           .to('file://destination.txt')
           .to('file://destination2.txt')
           .to('file://destination3.txt');

      (function(){routeProcessor.process(route);}).should.throw(error);

      expectedEndpointNames.length.should.equal(0);

    });

    it('An unsupported endpoint causes an error to be thrown', function() {

      var route = new camel.route();
      route.from('unsupported://source.txt')
           .to('file://destination.txt')
           .to('file://destination2.txt')
           .to('file://destination3.txt');

      (function(){routeProcessor.process(route);}).should.throw('Endpoint unsupported://source.txt is not supported');

    });

  });

});
