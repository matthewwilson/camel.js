var camel = require('../../../index.js');
var should = require('chai').should();
var cloneTracker = require('../../../modules/cloneHelper/cloneTracker.js');

exports.describe = function() {

    describe('#from', function() {

      it('Stores the endpoint in the queue array and returns itself', function() {

        var route = new camel.route();

        var myself = route.from('file://source.txt');

        route.queue.length.should.equal(1);

        myself.should.equal(route);

        route.getNextEndpoint().should.equal('file://source.txt');

      });

      it('Can only be called as the first method in the route', function() {

        var route = new camel.route();

        (function(){
          route.from('file://hello.txt')
               .to('file://destination.sql')
               .from('file://source.txt');
        }).should.throw('From method should only be called at the start of a route.');


      });

      it('Throws an error if the endpoint is undefined', function() {

        var route = new camel.route();

        (function(){
          route.from();
        }).should.throw('Please specify an endpoint uri');

      });

      it('Throws an error if the endpoint is not in the right format', function() {

        var route = new camel.route();

        (function(){
          route.from('hello world');
        }).should.throw('Endpoint uri is not in the correct format');

        (function(){
          route.from('HTTP://helloworld');
        }).should.throw('Endpoint uri is not in the correct format');

        (function(){
          route.from('file://');
        }).should.throw('Endpoint uri is not in the correct format');

        (function(){
          route.from('://');
        }).should.throw('Endpoint uri is not in the correct format');

        (function(){
          route.from('://source.txt');
        }).should.throw('Endpoint uri is not in the correct format');

      });

    });

    describe('#to', function() {

      it('Stores the endpoint in the queue array and returns itself', function() {

        var route = new camel.route();

        var myself = route.from('file://source.txt')
                          .to('file://destination.txt')
                          .to('file://anotherDestination.txt');

        route.queue.length.should.equal(3);

        myself.should.equal(route);

        route.getNextEndpoint().should.equal('file://source.txt');
        route.getNextEndpoint().should.equal('file://destination.txt');
        route.getNextEndpoint().should.equal('file://anotherDestination.txt');

      });

      it('Can only be called after the from function', function() {

        var route = new camel.route();

        (function(){
          route.to('file://hello.txt')
               .to('file://destination.sql')
               .from('file://source.txt');
        }).should.throw('To method should only be called after From.');


      });

      it('Throws an error if the endpoint is undefined', function() {

        var route = new camel.route();

        (function(){
          route.to();
        }).should.throw('Please specify an endpoint uri');

      });

      it('Throws an error if the endpoint is not in the right format', function() {

        var route = new camel.route();

        (function(){
          route.from('file://destination.txt').to('hello world');
        }).should.throw('Endpoint uri is not in the correct format');

        route = new camel.route();

        (function(){
          route.from('file://destination.txt').to('HTTP://helloworld');
        }).should.throw('Endpoint uri is not in the correct format');

        route = new camel.route();

        (function(){
          route.from('file://destination.txt').to('file://');
        }).should.throw('Endpoint uri is not in the correct format');

        route = new camel.route();

        (function(){
          route.from('file://destination.txt').to('://');
        }).should.throw('Endpoint uri is not in the correct format');

        route = new camel.route();

        (function(){
          route.from('file://destination.txt').to('://source.txt');
        }).should.throw('Endpoint uri is not in the correct format');

      });

    });

    describe('#addToQueue', function() {

      it('adds endpoints to the queue array', function() {

        var route = new camel.route();

        route.from('http://www.mwil.so').to('file://hello.txt');

        route.queue.length.should.equal(2);

        route.getNextEndpoint().should.equal('http://www.mwil.so');
        route.getNextEndpoint().should.equal('file://hello.txt');

        route.queue.length.should.equal(0);

      });

    });

    describe('#getNextEndpoint', function() {

      it('returns the next endpoint in the queue array and removes it from the queue', function() {

        var route = new camel.route();

        route.from('http://www.mwil.so').to('file://hello.txt');

        route.queue.length.should.equal(2);

        route.getNextEndpoint().should.equal('http://www.mwil.so');

        route.queue.length.should.equal(1);

        route.getNextEndpoint().should.equal('file://hello.txt');

        route.queue.length.should.equal(0);

      });

    });

    describe('#clone', function() {

      it('makes a copy of the route', function () {

        var route = new camel.route();
        route.id = "some id";
        cloneTracker.addParent(route.id);

        route.from('file://hello.world').to('file://destination.txt');

        var newRoute = route.clone();

        route.getNextEndpoint().should.equal('file://hello.world');
        route.hasStarted = true;
        route.body = "hello world";

        route.queue.length.should.equal(1);

        newRoute.queue.length.should.equal(2);
        newRoute.hasStarted.should.be.false;
        (newRoute.body === undefined).should.be.true;
        (newRoute.id === undefined).should.be.false;


      });

    });


};
