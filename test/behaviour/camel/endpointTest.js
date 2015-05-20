var should = require('chai').should();
var endpoint = require('../../../modules/endpoint.js');

describe('endpoint', function() {

  describe('#stripUriScheme', function() {

    it('removes file:// from start of endpoint', function() {

      var validFileEndpoint = new endpoint('file://source.txt');

      validFileEndpoint.hostname.should.equal('source.txt');

    });

    it('does not remove file:// from middle of endpoint', function() {

      var validFileEndpoint = new endpoint('http://file://source.txt');

      validFileEndpoint.hostname.should.equal('file://source.txt');

    });

    it('only removes file:// from start of endpoint, but does not remove it from elsewhere', function() {

      var validFileEndpoint = new endpoint('file://file://source.txt');

      validFileEndpoint.hostname.should.equal('file://source.txt');

    });

  });

  describe('#options', function() {

    it('returns the options of the query string', function() {

      var validFileEndpoint = new endpoint("file://source.txt?fileFilter=*.txt");

      validFileEndpoint.options.fileFilter.should.equal('*.txt');
      validFileEndpoint.hostname.should.equal('source.txt');

    });

    it('returns empty object if there is no query string', function() {

      var validFileEndpoint = new endpoint("file://source.txt");

      isEmptyObject(validFileEndpoint.options).should.be.true;
      validFileEndpoint.hostname.should.equal('source.txt');

    });

  });

  function isEmptyObject(obj) {
    return !Object.keys(obj).length;
  }

});
