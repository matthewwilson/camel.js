var camelTest = require('./camelTest.js');
var routeTest = require('./routeTest.js');


describe('camel', function() {

  describe('context', function() {
    camelTest.describe();
  });

  describe('route', function() {
    routeTest.describe();
  });


});
