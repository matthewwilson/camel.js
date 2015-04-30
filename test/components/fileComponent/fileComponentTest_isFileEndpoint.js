var should = require('chai').should();
var fileComponent = require('../../../modules/components/fileComponent.js');

exports.describe = function() {

  it('returns true if an endpoint starts with file://', function() {

    var validFileEndpoint = fileComponent.isFileEndpoint('file://source.txt');

    validFileEndpoint.should.be.a('boolean');
    validFileEndpoint.should.equal(true);

  });

  it('returns false if an endpoint does not start with file://', function() {

    var validFileEndpoint = fileComponent.isFileEndpoint('http://source.txt');

    validFileEndpoint.should.be.a('boolean');
    validFileEndpoint.should.equal(false);

  });

  it('returns false if an endpoint contains file://', function() {

    var validFileEndpoint = fileComponent.isFileEndpoint('http://file://source.txt');

    validFileEndpoint.should.be.a('boolean');
    validFileEndpoint.should.equal(false);

  });

  it('returns false if an endpoint is undefined', function() {

    var validFileEndpoint = fileComponent.isFileEndpoint(undefined);

    validFileEndpoint.should.be.a('boolean');
    validFileEndpoint.should.equal(false);

  });
};
