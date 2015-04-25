# camel.js [![npm version](https://badge.fury.io/js/camel.js.svg)](http://badge.fury.io/js/camel.js)
A camel-like implementation in node.js!

###Installation

Install using npm:

    npm install camel.js

###Setup

Require camel.js and create a new context:

    var camel = require('camel.js');

    context = new camel.context();

Create a new route and add it to the context

    route = new camel.route();

    route.from('file://source.txt')
         .to('file://result.txt');

    context.addRoute(route);

Start the context

    context.start();



This will execute a route that simply copies the source.txt contents to result.txt!

Routes are executed asynchronously, so adding a new route:

    route2 = new camel.route();

    route2.from('file://source2.txt')
          .to('file://result2.txt')
          .to('file://results2copy.txt');

    context.addRoute(route2);

Will happen in parallel with the other routes!
