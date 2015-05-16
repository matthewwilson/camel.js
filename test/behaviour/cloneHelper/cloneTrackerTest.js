var cloneTracker = require('../../../modules/cloneHelper/cloneTracker.js');
var should = require('chai').should();

describe('cloneTracker', function(){

  beforeEach(function() {
    cloneTracker.clear();
  });

  afterEach(function() {
    cloneTracker.clear();
  });

  describe('#addParent', function() {

    it('Stores the parent in the routes array', function() {

      cloneTracker.addParent('1234');

      cloneTracker.getRoutes().length.should.equal(1);
      cloneTracker.getRoutes()[0].routeId.should.equal('1234');

    });

  });

  describe('#addClone', function() {

    it('Stores the clone in the parent, if it exists in the routes array', function() {

      cloneTracker.addParent('1234');
      cloneTracker.addClone('1234', '5678');

      cloneTracker.getRoutes().length.should.equal(1);
      cloneTracker.getRoutes()[0].routeId.should.equal('1234');
      cloneTracker.getRoutes()[0].hasClone('5678').should.be.true;

    });

    it('Stores the clone in the clone, if it exists in the parent in the routes array', function() {

      cloneTracker.addParent('1234');
      cloneTracker.addClone('1234', '5678');
      cloneTracker.addClone('5678', '91011');
      cloneTracker.addClone('91011', '234234');

      cloneTracker.getRoutes().length.should.equal(1);
      cloneTracker.getRoutes()[0].routeId.should.equal('1234');
      cloneTracker.getRoutes()[0].hasClone('5678').should.be.true;
      cloneTracker.getRoutes()[0].getClone('5678').hasClone('91011').should.be.true;
      cloneTracker.getRoutes()[0].getClone('5678').getClone('91011').hasClone('234234').should.be.true;

    });

    it('Throws an error if the parent doesnt exist', function() {

      (function(){cloneTracker.addClone('1234', '5678');}).should.throw('Unable to add clone, perhaps the parent doesnt exist');

    });

  });

  describe('#finishRoute', function() {

    it('Finishes a parent, if it exists in the routes array', function() {

      cloneTracker.addParent('1234');
      cloneTracker.addClone('1234', '5678');

      cloneTracker.finishRoute('1234');
      cloneTracker.getRoutes()[0].finished.should.be.true;
      cloneTracker.getRoutes()[0].hasFinished().should.be.false;

    });

    it('Throws an error if a route was not found.', function() {
      (function(){cloneTracker.finishRoute('1234');}).should.throw('Unable to find route to finish with id: 1234');
    });

    it('Finishes a clone, if it exists in the parent', function() {

      cloneTracker.addParent('1234');
      cloneTracker.addClone('1234', '5678');

      cloneTracker.finishRoute('5678');
      cloneTracker.getRoutes()[0].finished.should.be.false;
      cloneTracker.getRoutes()[0].hasFinished().should.be.false;
      cloneTracker.getRoutes()[0].getClone('5678').finished.should.be.true;
      cloneTracker.getRoutes()[0].getClone('5678').hasFinished().should.be.true;

    });

    it('Finishes a clone, if it exists in the clone', function() {

      cloneTracker.addParent('1234');
      cloneTracker.addClone('1234', '5678');
      cloneTracker.addClone('5678', '8907');

      cloneTracker.finishRoute('8907');
      cloneTracker.getRoutes()[0].finished.should.be.false;
      cloneTracker.getRoutes()[0].hasFinished().should.be.false;
      cloneTracker.getRoutes()[0].getClone('5678').finished.should.be.false;
      cloneTracker.getRoutes()[0].getClone('5678').hasFinished().should.be.false;
      cloneTracker.getRoutes()[0].getClone('5678').getClone('8907').finished.should.be.true;
      cloneTracker.getRoutes()[0].getClone('5678').getClone('8907').hasFinished().should.be.true;

    });

  });

  describe('#allClonesFinished', function() {

    it('returns true if a parent is finished', function() {

      cloneTracker.addParent('12345');
      cloneTracker.finishRoute('12345');

      cloneTracker.allClonesFinished('12345').should.be.true;

    });

    it('returns true, if parent and clones are finished', function() {

      cloneTracker.addParent('12345');
      cloneTracker.addClone('12345', '5678');
      cloneTracker.addClone('12345', '56781');
      cloneTracker.addClone('12345', '56782');
      cloneTracker.addClone('12345', '56783');
      cloneTracker.addClone('12345', '56784');
      cloneTracker.addClone('12345', '56785');

      cloneTracker.finishRoute('12345');
      cloneTracker.finishRoute('5678');
      cloneTracker.finishRoute('56781');
      cloneTracker.finishRoute('56782');
      cloneTracker.finishRoute('56783');
      cloneTracker.finishRoute('56784');
      cloneTracker.finishRoute('56785');

      cloneTracker.allClonesFinished('12345').should.be.true;

    });

    it('returns false, if parent is not finished', function() {

      cloneTracker.addParent('1234');
      cloneTracker.allClonesFinished('1234').should.be.false;

    });

    it('returns false, if clone is not finished', function() {

      cloneTracker.addParent('1234');
      cloneTracker.addClone('1234','5678');

      cloneTracker.finishRoute('1234');
      cloneTracker.allClonesFinished('1234').should.be.false;

    });

    it('returns false, if parent not finished, but clone is finished', function() {

      cloneTracker.addParent('1234');
      cloneTracker.addClone('1234','5678');

      cloneTracker.finishRoute('5678');
      cloneTracker.allClonesFinished('1234').should.be.false;

    });

  });

});
