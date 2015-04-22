# camel.js
A camel-like implementation in node.js!

Currently a proof of concept app can be executed using:

    node index.js

This will execute the route:

    route.from('file://source.txt')
         .to('file://result.txt');

Which simply copies the source.txt contents to result.txt!

Routes are executed asynchronously, so adding a new route:

    route2 = new camel.route();

    route2.from('file://source2.txt')
          .to('file://result2.txt');

    context.addRoute(route2);

Will happen in parallel with the other routes!
