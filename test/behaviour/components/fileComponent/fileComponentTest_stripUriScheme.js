var should = require('chai').should();
var fileComponent = require('../../../../modules/components/fileComponent.js');


exports.describe = function() {

  it('removes file:// from start of endpoint', function() {

    var validFileEndpoint = fileComponent.stripUriScheme('file://source.txt');

    validFileEndpoint.should.be.a('string');
    validFileEndpoint.should.equal('source.txt');

  });

  it('does not remove file:// from middle of endpoint', function() {

    var validFileEndpoint = fileComponent.stripUriScheme('http://file://source.txt');

    validFileEndpoint.should.be.a('string');
    validFileEndpoint.should.equal('http://file://source.txt');

  });

  it('only removes file:// from start of endpoint, but does not remove it from elsewhere', function() {

    var validFileEndpoint = fileComponent.stripUriScheme('file://file://source.txt');

    validFileEndpoint.should.be.a('string');
    validFileEndpoint.should.equal('file://source.txt');

  });

};
