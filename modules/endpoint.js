var url = require('url');

module.exports = function(uri) {

  this.stripUriScheme = function(uri) {

    if(uri.indexOf(this.protocol+'//') === 0) {
      return uri.replace(this.protocol+'//','');
    }

    return uri;
  };

  this.href = uri;
  this.endpoint = url.parse(uri);
  this.protocol = this.endpoint.protocol;
  this.hostname = this.stripUriScheme(uri);


};
