var cloned = require('../../../modules/cloneHelper/cloned.js');
var should = require('chai').should();

describe('cloned', function(){

  describe('#addClone', function() {

    it('Stores the cloned route in the clones array', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "RouteId";

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

    it('returns false if the parent route is not finished and has no clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      parentRoute.hasFinished().should.be.false;

    });

    it('returns true if the parent route is finished and has no clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = true;

      parentRoute.hasFinished().should.be.true;

    });

    var generateClonedRoute = function(finished) {
      var clonedRoute = new cloned();
      clonedRoute.finished = finished;
      clonedRoute.routeId = Math.floor((Math.random() * 1000000) + 1);

      return clonedRoute;
    };

    it('returns false if the parent route is not finished and has no finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = false;

      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));

      parentRoute.hasFinished().should.be.false;

    });

    it('returns false if the parent route is not finished and has finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = false;

      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));

      parentRoute.hasFinished().should.be.false;

    });

    it('returns false if the parent route is finished and has no finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = true;

      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));

      parentRoute.hasFinished().should.be.false;

    });

    it('returns false if the parent route is finished and has some finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = true;

      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));

      parentRoute.hasFinished().should.be.false;

    });

    it('returns false if the parent route is not finished and has some finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = false;

      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(false));
      parentRoute.addClone(generateClonedRoute(false));

      parentRoute.hasFinished().should.be.false;

    });

    it('returns true if the parent route is finished and has finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = true;

      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));
      parentRoute.addClone(generateClonedRoute(true));

      parentRoute.hasFinished().should.be.true;

    });

    //subclones

    it('returns false if the parent route is not finished and has no finished clones, that have no finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = false;


      var clone = generateClonedRoute(false);
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(false));

      var clone1 = generateClonedRoute(false);
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(false));

      var clone2 = generateClonedRoute(false);
      clone2.addClone(generateClonedRoute(false));
      clone2.addClone(generateClonedRoute(false));
      clone2.addClone(generateClonedRoute(false));
      clone2.addClone(generateClonedRoute(false));

      parentRoute.addClone(clone);
      parentRoute.addClone(clone1);
      parentRoute.addClone(clone2);

      parentRoute.hasFinished().should.be.false;

    });

    it('returns false if the parent route is not finished and has finished clones, with finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = false;

      var clone = generateClonedRoute(true);
      clone.addClone(generateClonedRoute(true));
      clone.addClone(generateClonedRoute(true));
      clone.addClone(generateClonedRoute(true));
      clone.addClone(generateClonedRoute(true));

      var clone1 = generateClonedRoute(true);
      clone1.addClone(generateClonedRoute(true));
      clone1.addClone(generateClonedRoute(true));
      clone1.addClone(generateClonedRoute(true));
      clone1.addClone(generateClonedRoute(true));

      var clone2 = generateClonedRoute(true);
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));

      parentRoute.addClone(clone);
      parentRoute.addClone(clone1);
      parentRoute.addClone(clone2);

      parentRoute.hasFinished().should.be.false;

    });

    it('returns false if the parent route is finished and has no finished clones, with no finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = true;

      var clone = generateClonedRoute(false);
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(false));

      var clone1 = generateClonedRoute(false);
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(false));

      var clone2 = generateClonedRoute(false);
      clone2.addClone(generateClonedRoute(false));
      clone2.addClone(generateClonedRoute(false));
      clone2.addClone(generateClonedRoute(false));
      clone2.addClone(generateClonedRoute(false));

      parentRoute.addClone(clone);
      parentRoute.addClone(clone1);
      parentRoute.addClone(clone2);

      parentRoute.hasFinished().should.be.false;

    });

    it('returns false if the parent route is finished and has some finished clones, with some finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = true;

      var clone = generateClonedRoute(false);
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(true));
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(false));

      var clone1 = generateClonedRoute(true);
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(true));
      clone1.addClone(generateClonedRoute(false));

      var clone2 = generateClonedRoute(true);
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));

      parentRoute.addClone(clone);
      parentRoute.addClone(clone1);
      parentRoute.addClone(clone2);


      parentRoute.hasFinished().should.be.false;

    });

    it('returns false if the parent route is not finished and has some finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = false;

      var clone = generateClonedRoute(false);
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(true));
      clone.addClone(generateClonedRoute(false));
      clone.addClone(generateClonedRoute(false));

      var clone1 = generateClonedRoute(true);
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(false));
      clone1.addClone(generateClonedRoute(true));
      clone1.addClone(generateClonedRoute(false));

      var clone2 = generateClonedRoute(true);
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));

      parentRoute.addClone(clone);
      parentRoute.addClone(clone1);
      parentRoute.addClone(clone2);

      parentRoute.hasFinished().should.be.false;

    });

    it('returns true if the parent route is finished and has finished clones', function() {
      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";
      parentRoute.finished = true;

      var clone = generateClonedRoute(true);
      clone.addClone(generateClonedRoute(true));
      clone.addClone(generateClonedRoute(true));
      clone.addClone(generateClonedRoute(true));
      clone.addClone(generateClonedRoute(true));

      var clone1 = generateClonedRoute(true);
      clone1.addClone(generateClonedRoute(true));
      clone1.addClone(generateClonedRoute(true));
      clone1.addClone(generateClonedRoute(true));
      clone1.addClone(generateClonedRoute(true));

      var clone2 = generateClonedRoute(true);
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));
      clone2.addClone(generateClonedRoute(true));

      parentRoute.addClone(clone);
      parentRoute.addClone(clone1);
      parentRoute.addClone(clone2);

      parentRoute.hasFinished().should.be.true;

    });


  });

  describe('#hasClone', function() {

    it('returns false if the parent has no clones', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      parentRoute.hasClone('hello').should.be.false;
      parentRoute.hasClone('ParentRouteId').should.be.false;

    });

    it('returns true if the parent has the clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      parentRoute.addClone(cloneRoute);

      parentRoute.hasClone("CloneRouteId").should.be.true;

    });

    it('returns false if the parent does not have the clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      parentRoute.addClone(cloneRoute);

      parentRoute.hasClone("CloneRouteId2").should.be.false;

    });

    it('returns true if the parent has a sub clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      var cloneRoute2 = new cloned();
      cloneRoute2.routeId = "CloneRouteId2";

      var cloneRoute3 = new cloned();
      cloneRoute3.routeId = "CloneRouteId3";

      var cloneRoute4 = new cloned();
      cloneRoute4.routeId = "CloneRouteId4";

      cloneRoute3.addClone(cloneRoute4);
      cloneRoute2.addClone(cloneRoute3);
      cloneRoute.addClone(cloneRoute2);

      parentRoute.addClone(cloneRoute);

      parentRoute.hasClone("CloneRouteId").should.be.true;
      parentRoute.hasClone("CloneRouteId2").should.be.true;
      parentRoute.hasClone("CloneRouteId3").should.be.true;
      parentRoute.hasClone("CloneRouteId4").should.be.true;

    });

    it('returns false if the parent does not have the sub clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      var cloneRoute2 = new cloned();
      cloneRoute2.routeId = "CloneRouteId2";

      var cloneRoute3 = new cloned();
      cloneRoute3.routeId = "CloneRouteId3";

      var cloneRoute4 = new cloned();
      cloneRoute4.routeId = "CloneRouteId4";

      cloneRoute3.addClone(cloneRoute4);
      cloneRoute2.addClone(cloneRoute3);
      cloneRoute.addClone(cloneRoute2);

      parentRoute.addClone(cloneRoute);

      parentRoute.hasClone("CloneRouteId5").should.be.false;
      parentRoute.hasClone("CloneRouteId62").should.be.false;
      parentRoute.hasClone("CloneRouteId37").should.be.false;
      parentRoute.hasClone("CloneRouteId47").should.be.false;

    });

  });



  describe('#getClone', function() {

    it('returns undefined if the parent has no matching clones', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      (parentRoute.getClone('hello') === undefined).should.be.true;

    });

    it('returns the clone if the parent has the clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      parentRoute.addClone(cloneRoute);

      (parentRoute.getClone("CloneRouteId") === undefined).should.be.false;

    });

    it('returns undefined if the parent does not have the clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      parentRoute.addClone(cloneRoute);

      (parentRoute.getClone('CloneRouteId2') === undefined).should.be.true;

    });

    it('returns the clone if the parent has a sub clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      var cloneRoute2 = new cloned();
      cloneRoute2.routeId = "CloneRouteId2";

      var cloneRoute3 = new cloned();
      cloneRoute3.routeId = "CloneRouteId3";

      var cloneRoute4 = new cloned();
      cloneRoute4.routeId = "CloneRouteId4";

      cloneRoute3.addClone(cloneRoute4);
      cloneRoute2.addClone(cloneRoute3);
      cloneRoute.addClone(cloneRoute2);

      parentRoute.addClone(cloneRoute);

      (parentRoute.getClone("CloneRouteId") === undefined).should.be.false;
      (parentRoute.getClone("CloneRouteId2") === undefined).should.be.false;
      (parentRoute.getClone("CloneRouteId3") === undefined).should.be.false;
      (parentRoute.getClone("CloneRouteId4") === undefined).should.be.false;

      parentRoute.getClone("CloneRouteId4").routeId == "CloneRouteId4";

    });

    it('returns undefined if the parent does not have the sub clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      var cloneRoute2 = new cloned();
      cloneRoute2.routeId = "CloneRouteId2";

      var cloneRoute3 = new cloned();
      cloneRoute3.routeId = "CloneRouteId3";

      var cloneRoute4 = new cloned();
      cloneRoute4.routeId = "CloneRouteId4";

      cloneRoute3.addClone(cloneRoute4);
      cloneRoute2.addClone(cloneRoute3);
      cloneRoute.addClone(cloneRoute2);

      parentRoute.addClone(cloneRoute);

      (parentRoute.getClone("CloneRouteId5") === undefined).should.be.true;
      (parentRoute.getClone("CloneRouteId62") === undefined).should.be.true;
      (parentRoute.getClone("CloneRouteId37") === undefined).should.be.true;
      (parentRoute.getClone("CloneRouteId47") === undefined).should.be.true;

    });

  });

  describe('#finishClone', function() {


    it('finishes the clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      parentRoute.addClone(cloneRoute);

      parentRoute.finishClone("CloneRouteId");

      parentRoute.getClone("CloneRouteId").finished.should.be.true;
      parentRoute.finished.should.be.false;

    });

    it('finishes the clone if the parent has a sub clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      var cloneRoute2 = new cloned();
      cloneRoute2.routeId = "CloneRouteId2";

      var cloneRoute3 = new cloned();
      cloneRoute3.routeId = "CloneRouteId3";

      var cloneRoute4 = new cloned();
      cloneRoute4.routeId = "CloneRouteId4";

      cloneRoute3.addClone(cloneRoute4);
      cloneRoute2.addClone(cloneRoute3);
      cloneRoute.addClone(cloneRoute2);

      parentRoute.addClone(cloneRoute);

      parentRoute.finishClone("CloneRouteId4");

      parentRoute.getClone("CloneRouteId4").finished.should.be.true;
      parentRoute.getClone("CloneRouteId").finished.should.be.false;
      parentRoute.getClone("CloneRouteId2").finished.should.be.false;
      parentRoute.getClone("CloneRouteId3").finished.should.be.false;

      parentRoute.finished.should.be.false;

    });

    it('throws error if the parent does not have the clone with the matching id', function() {

      var parentRoute = new cloned();
      parentRoute.routeId = "ParentRouteId";

      var cloneRoute = new cloned();
      cloneRoute.routeId = "CloneRouteId";

      parentRoute.addClone(cloneRoute);

      (function() {parentRoute.finishClone('CloneRouteId2');}).should.throw('Couldnt find clone to finish');

    });

  });


});
