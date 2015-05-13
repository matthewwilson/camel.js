module.exports = function () {

  this.routeId = undefined;
  this.clones = [];
  this.finished = false;

  this.getClones = function() {
    return this.clones;
  };

  this.addClone = function(clone) {
    this.clones.push(clone);
  };

  this.hasFinished = function() {
    return this.finished && this.clonesFinished();
  };

  this.clonesFinished = function() {

    var allClonesFinished = true;

    this.clones.forEach(function(clone) {
      if(clone.hasFinished() === false) {
        allClonesFinished = false;
        return;
      }
    });

    return allClonesFinished;

  };

  this.hasClone = function(id) {
    var foundClone = false;

    this.clones.forEach(function(clone) {
      if(clone.routeId == id) {
        foundClone = true;
        return;
      } else if(clone.hasClone(id)) {
        foundClone = true;
        return;
      }
    });

    return foundClone;
  };

  this.getClone = function(id) {

    var foundClone;

    this.clones.forEach(function(clone) {
      if(clone.routeId == id) {
        foundClone = clone;
        return;
      } else if(clone.hasClone(id)) {

        foundClone = clone.getClone(id);
        return;
      }
    });

    return foundClone;

  };

  this.finishClone = function(id) {
    this.clones.forEach(function(clone) {

      if(clone.routeId == id) {
        clone.finished = true;
        return;
      } else {
        clone.finishClone(id);
      }

    });
  };



};
