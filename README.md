# camel.js
A camel-like implementation in node.js!

Currently a proof of concept app can be executed using:

    node index.js

This will execute the route:

    route.from('file://source.txt')
         .to('file://result.txt');

Which simply copies the source.txt contents to result.txt!
