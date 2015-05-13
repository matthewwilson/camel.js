var cloned = require('../../../modules/cloneHelper/cloned.js');
var should = require('chai').should();

describe('cloned', function(){

  describe('#addClone', function() {

    it('Stores the cloned route in the clones array', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "RouteId"

      parentRoute.finished.should.be.false;

      var clonedRoute = new cloned();
      clonedRoute.routeId = "ClonedId";

      parentRoute.addClone(clonedRoute);

      parentRoute.getClones().length.should.equal(1);

      var clone = parentRoute.getClone("ClonedId");
      clone.should.not.be.undefined;
      clone.routeId.should.equal("ClonedId");
      clone.finished.should.be.false;
      clone.getClones().length.should.equal(0);

    });

  });

  describe('#hasFinished', function() {

    

  });

});
