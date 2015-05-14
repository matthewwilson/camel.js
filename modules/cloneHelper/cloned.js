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

    for(var i = 0; i < this.clones.length; i++) {

      var clone = this.clones[i];

      if(!clone.hasFinished()) {
        return false;
      }
    }

    return true;

  };

  this.hasClone = function(id) {

    for(var i = 0; i < this.clones.length; i++) {

      var clone = this.clones[i];

      if(clone.routeId == id || clone.hasClone(id)) {
        return true;
      }
    }

    return false;

  };

  this.getClone = function(id) {

    for(var i = 0; i < this.clones.length; i++) {

      var clone = this.clones[i];

      if(clone.routeId == id) {
        return clone;
      } else if(clone.hasClone(id)) {
        return clone.getClone(id);
      }
    }

  };

  this.finishClone = function(id) {

    var result = this.finish(id);

    if(!result) {
      throw new Error('Couldnt find clone to finish');
    }

  };

  this.finish = function(id) {

    for(var i = 0; i < this.clones.length; i++) {

      var clone = this.clones[i];

      if(clone.routeId == id) {
        clone.finished = true;
        return true;
      } else if(clone.finish(id)){
        return true;
      }
    }

    return false;
  };



};
