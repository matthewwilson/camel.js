var fileComponent_from = require('./fileComponentTest_from.js');
var fileComponent_isFileEndpoint = require('./fileComponentTest_isFileEndpoint.js');
var fileComponent_stripUriScheme = require('./fileComponentTest_stripUriScheme.js');
var fileComponent_to = require('./fileComponentTest_to.js');


describe('fileComponent', function() {

  describe('#from', function() {
    fileComponent_from.describe();
  });

  describe('#isFileEndpoint', function() {
    fileComponent_isFileEndpoint.describe();
  });

  describe('#stripUriScheme', function() {
    fileComponent_stripUriScheme.describe();
  });

  describe('#to', function() {
    fileComponent_to.describe();
  });

});
