var camel = require('../../index.js');
var should = require('chai').should();
var processor = require('../../modules/processors/routeProcessor.js');

exports.describe = function() {

    describe('#addRoute', function() {

      it('Stores all routes that have been added', function() {

        var context = new camel.context();

        var route = new camel.route();
        route.from('file://source.txt').to('file://destination.txt');

        context.addRoute(route);

        context.routes.length.should.equal(1);

        var route2 = new camel.route();
        route2.from('file://source.txt').to('file://destination.txt');

        context.addRoute(route2);

        context.routes.length.should.equal(2);

      });

    });

    describe('#start', function() {

      var originalProcessor;

      beforeEach(function(){
        originalProcessor = processor.process;
      });

      afterEach(function(){
        processor.process = originalProcessor;
      });

      it('Starts all the routes', function() {

        var expectedIds = ['rotue1', 'route2'];

        processor.process = function(route) {
          route.id.should.equal(expectedIds.shift());
        };

        var context = new camel.context();

        var route = new camel.route();
        route.id = 'rotue1';
        route.from('file://source.txt').to('file://destination.txt');

        context.addRoute(route);

        context.routes.length.should.equal(1);

        var route2 = new camel.route();
        route2.id = 'route2';
        route2.from('file://source.txt').to('file://destination.txt');

        context.addRoute(route2);

        context.routes.length.should.equal(2);

        context.start();

      });

    });

};
