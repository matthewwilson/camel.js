var camel = require('./camel/camel.js');

context = new camel.context();

route = new camel.route();

route.from('file://source.txt')
     .to('file://result.txt');

context.addRoute(route);

route2 = new camel.route();

route2.from('file://source2.txt')
     .to('file://result2.txt')
     .to('file://result2copy.txt');

context.addRoute(route2);

context.start();
