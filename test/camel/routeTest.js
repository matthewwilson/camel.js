var camel = require('../../index.js');
var should = require('chai').should();

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

};
