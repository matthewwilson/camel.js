var routeProcessor = require('./modules/processors/routeProcessor.js');
var message = require('./modules/message.js');
var cloner = require('clone');
var cloneTracker = require('./modules/cloneHelper/cloneTracker.js');
var endpoint = require('./modules/endpoint.js');

exports.context = function context() {

  this.routes = [];

  this.addRoute = function(route) {
    route.context = this;
    this.routes.push(route);
  };

  this.start = function(callback) {

    this.routes.forEach(function(route) {

      if(route.id === undefined) {
        route.id = Math.floor((Math.random() * 1000000) + 1);
      }

      cloneTracker.addParent(route.id);
      routeProcessor.process(route, callback);
    });

  };

};

exports.route = function route() {

  this.queue = [];
  this.hasStarted = false;
  this.message = new message();
  this.id = undefined;

  this.from = function(uri) {

    if(!uri) {
      throw new Error('Please specify an endpoint uri');
    } else if(this.queue.length > 0) {
      throw new Error('From method should only be called at the start of a route.');
    } else if(!new RegExp('[a-z]{1,}\:\/\/.{1,}').test(uri)) {
      throw new Error('Endpoint uri is not in the correct format');
    }

    this.addToQueue(new endpoint(uri));
    return this;
  };

  this.to = function(uri) {

    if(!uri) {
      throw new Error('Please specify an endpoint uri');
    } else if(this.queue.length === 0) {
      throw new Error('To method should only be called after From.');
    } else if(!new RegExp('[a-z]{1,}\:\/\/.{1,}').test(uri)) {
      throw new Error('Endpoint uri is not in the correct format');
    }

    this.addToQueue(new endpoint(uri));
    return this;
  };

  this.addToQueue = function(uri) {
    this.queue.push(uri);
  };

  this.getNextEndpoint = function() {
    return this.queue.shift();
  };

  this.clone = function() {

    var clone = cloner(this);

    clone.id = this.id + '_' + Math.floor((Math.random() * 1000000) + 1);

    cloneTracker.addClone(this.id, clone.id);

    return clone;

  };


};
