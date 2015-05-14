var cloned = require('./cloned.js');

var routes = [];

exports.addParent = function(parentRouteId) {

  var parent = new cloned();
  parent.routeId = parentRouteId;

  routes.push(parent);

};

exports.addClone = function(parentRouteId, cloneRouteId) {

  for(var i = 0; i < routes.length; i++) {

    var route = routes[i];

    if(route.routeId == parentRouteId) {
      var clone = new cloned();
      clone.routeId = cloneRouteId;

      route.addClone(clone);
      break;

    } else if(route.hasClone(parentRouteId)) {

      var clone = new cloned();
      clone.routeId = cloneRouteId;

      route.getClone(parentRouteId).addClone(clone);
      break;

    }

  }

};

exports.finishRoute = function(routeId) {

  for(var i = 0; i < routes.length; i++) {

    var route = routes[i];

    if(route.routeId == routeId) {
      route.finished = true;
      break;
    } else if(route.hasClone(routeId)) {
      route.finishClone(routeId);
      break;
    }
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
