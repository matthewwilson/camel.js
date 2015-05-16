var cloned = require('./cloned.js');

var routes = [];

exports.getRoutes = function() {
  return routes;
};

exports.addParent = function(parentRouteId) {

  var parent = new cloned();
  parent.routeId = parentRouteId;

  routes.push(parent);

};

exports.addClone = function(parentRouteId, cloneRouteId) {

  var added = false;

  for(var i = 0; i < routes.length; i++) {

    var route = routes[i];

    if(route.routeId == parentRouteId) {
      var clone = new cloned();
      clone.routeId = cloneRouteId;

      route.addClone(clone);
      added = true;
      break;

    } else if(route.hasClone(parentRouteId)) {

      var clone = new cloned();
      clone.routeId = cloneRouteId;

      route.getClone(parentRouteId).addClone(clone);
      added = true;
      break;

    }

  }

  if(!added) {
    throw new Error('Unable to add clone, perhaps the parent doesnt exist');
  }

};

exports.finishRoute = function(routeId) {

  var finishedSomething = false;

  for(var i = 0; i < routes.length; i++) {

    var route = routes[i];

    if(route.routeId == routeId) {
      route.finished = true;
      finishedSomething = true;
      break;
    } else if(route.hasClone(routeId)) {
      route.finishClone(routeId);
      finishedSomething = true;
      break;
    }
  }

  if(!finishedSomething) {
    throw new Error('Unable to find route to finish with id: '+routeId);
  }

};

exports.allClonesFinished = function(routeId) {

  for(var i = 0; i < routes.length; i++) {

    var route = routes[i];

    if(route.routeId == routeId || route.hasClone(routeId)) {
      return(route.hasFinished());
    }
  }

  return false;
};

exports.clear = function() {
  routes = [];
};
