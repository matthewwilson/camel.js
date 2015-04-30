var fileComponent = require('../components/fileComponent.js');

var processFunction = function(err, route) {

  if(err) {
    throw err;
  }

  var currentEndpoint = route.getNextEndpoint();

  if(currentEndpoint !== undefined) {

    if(fileComponent.isFileEndpoint(currentEndpoint)) {

      if(!route.hasStarted) {

        route.hasStarted = true;

        fileComponent.from(currentEndpoint, route, processFunction);

      } else {

        fileComponent.to(currentEndpoint, route, processFunction);

      }

    } else {
      throw new Error("Endpoint "+currentEndpoint+" is not supported");
    }
  }

};

exports.process = function (route) {
  processFunction(undefined, route);
};
