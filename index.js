var routeProcessor = require('./modules/processors/routeProcessor.js');

module.exports.context = function context() {

  this.routes = [];

  this.addRoute = function(route) {
    this.routes.push(route);
  };

  this.start = function() {

    this.routes.forEach(function(route) {
      routeProcessor.process(route);
    });

  };

};

module.exports.route = function route() {

  this.queue = [];
  this.hasStarted = false;
  this.body = undefined;

  this.from = function(uri) {
    this.addToQueue(uri);
    return this;
  };

  this.to = function(uri) {
    this.addToQueue(uri);
    return this;
  };

  this.addToQueue = function(uri) {
    this.queue.push(uri);
  };

  this.getNextEndpoint = function() {
    return this.queue.shift();
  };


};
