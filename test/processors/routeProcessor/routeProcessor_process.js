var should = require('chai').should();
var fileComponent = require('../../../modules/components/fileComponent.js');
var camel = require('../../../index.js');
var routeProcessor = require('../../../modules/processors/routeProcessor.js');


describe('#routeProcessor.process', function() {

  it('A route with 2 endpoints is successfully processed', function() {

    var originalFileComponent = fileComponent;

    fileComponent.from = function (endpoint, route, callback) {

      endpoint.should.equal('file://source.txt');

      route.body = new Buffer('hello world');

      callback(undefined, route);

    };

    fileComponent.to = function (endpoint, route, callback) {

      endpoint.should.equal('file://destination.txt');

      route.body.toString().should.equal('hello world');

      callback(undefined, route);

    };

    var route = new camel.route();
    route.from('file://source.txt')
         .to('file://destination.txt');

    routeProcessor.process(route);


    fileComponent = originalFileComponent;

  });

});
