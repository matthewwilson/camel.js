var should = require('chai').should();
var fileComponent = require('../../../../modules/components/fileComponent.js');
var endpoint = require('../../../../modules/endpoint.js');

exports.describe = function() {

  it('returns true if an endpoint starts with file://', function() {

    var validFileEndpoint = fileComponent.isFileEndpoint(new endpoint('file://source.txt'));

    validFileEndpoint.should.be.a('boolean');
    validFileEndpoint.should.equal(true);

  });

  it('returns false if an endpoint does not start with file://', function() {

    var validFileEndpoint = fileComponent.isFileEndpoint(new endpoint('http://source.txt'));

    validFileEndpoint.should.be.a('boolean');
    validFileEndpoint.should.equal(false);

  });

  it('returns false if an endpoint contains file://', function() {

    var validFileEndpoint = fileComponent.isFileEndpoint(new endpoint('http://file://source.txt'));

    validFileEndpoint.should.be.a('boolean');
    validFileEndpoint.should.equal(false);

  });

  it('returns false if an endpoint is undefined', function() {

    var validFileEndpoint = fileComponent.isFileEndpoint(undefined);

    validFileEndpoint.should.be.a('boolean');
    validFileEndpoint.should.equal(false);

  });
};
