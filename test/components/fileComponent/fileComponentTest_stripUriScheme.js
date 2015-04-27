var should = require('chai').should(),
fileComponent = require('../../../modules/components/fileComponent.js'),
file = new fileComponent(),
stripUriScheme = file.stripUriScheme;

describe('#fileComponent.stripUriScheme', function() {

  it('removes file:// from start of endpoint', function() {

    var validFileEndpoint = stripUriScheme('file://source.txt');

    validFileEndpoint.should.be.a('string');
    validFileEndpoint.should.equal('source.txt');

  });

  it('does not remove file:// from middle of endpoint', function() {

    var validFileEndpoint = stripUriScheme('http://file://source.txt');

    validFileEndpoint.should.be.a('string');
    validFileEndpoint.should.equal('http://file://source.txt');

  });

  it('only removes file:// from start of endpoint, but does not remove it from elsewhere', function() {

    var validFileEndpoint = stripUriScheme('file://file://source.txt');

    validFileEndpoint.should.be.a('string');
    validFileEndpoint.should.equal('file://source.txt');

  });

});
