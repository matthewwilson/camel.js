var camel = require('./camel/camel.js');

context = new camel.context();

route = new camel.route();

route.from('file://source.txt')
     .to('file://result.txt');

context.addRoute(route);

context.start();
