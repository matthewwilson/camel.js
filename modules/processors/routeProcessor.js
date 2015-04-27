var fileComponent = require('../components/fileComponent.js');

module.exports = function routeProcessor() {

  var file = new fileComponent();

  var processFunction = function(err, route) {

    if(err) {
      throw err;
    }

    var currentEndpoint = route.getNextEndpoint();

    if(currentEndpoint !== undefined) {

      if(file.isFileEndpoint(currentEndpoint)) {

        if(!route.hasStarted) {

          route.hasStarted = true;

          file.from(currentEndpoint, route, processFunction);

        } else {

          file.to(currentEndpoint, route, processFunction);

        }

      }
    }

  };

  this.process = function(route) {
    processFunction(undefined, route);
  };

};
