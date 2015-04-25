var fileComponent = require('../components/fileComponent.js');

module.exports = function routeProcessor() {

  var processFunction = function(route) {
    var file = new fileComponent();

    var currentEndpoint = route.getNextEndpoint();

    if(currentEndpoint !== undefined) {

      if(file.isFileEndpoint(currentEndpoint)) {

        if(!route.hasStarted) {

          console.log('processing from');

          route.hasStarted = true;

          file.from(currentEndpoint, route, processFunction);

        } else {

          console.log('processing to');

          file.to(currentEndpoint, route, processFunction);

        }

      }
    }

  };

  this.process = function(route) {
    processFunction(route);
  };

};
