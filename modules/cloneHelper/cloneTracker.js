var cloned = require('./cloned.js');

var routes = [];

exports.addParent = function(parentRouteId) {

  var parent = new cloned();
  parent.routeId = parentRouteId;

  routes.push(parent);

};

exports.addClone = function(parentRouteId, cloneRouteId) {

  routes.forEach(function(route) {

    if(route.routeId == parentRouteId) {
      var clone = new cloned();
      clone.routeId = cloneRouteId;

      route.addClone(clone);
      return;
    } else if(route.hasClone(parentRouteId)) {

      var clone = new cloned();
      clone.routeId = cloneRouteId;

      route.getClone(parentRouteId).addClone(clone);
      return;
    }

  });

};

exports.finishRoute = function(routeId) {
  routes.forEach(function(route) {

    if(route.routeId == routeId) {
      route.finished = true;
      return;
    } else if(route.hasClone(routeId)) {
      route.finishClone(routeId);
      return;
    }

  });
};

exports.allClonesFinished = function(routeId) {

  var finished = false;

  routes.forEach(function(route) {

    if(route.routeId == routeId || route.hasClone(routeId)) {
      finished = route.hasFinished();
      return;
    }

  });

  return finished;
};

exports.clear = function() {
  routes = [];
};
