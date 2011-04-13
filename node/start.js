var mustache = require("mustache");
var http = require('http');

// TODO: Load template
var template = "{{say_hello}}, {{name}}";
// TODO: Load facts
// TODO: Load bullshit
// TODO: Setup watchFile on facts and BS

// Startup server
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); // Send headers

    // TODO: Decide if fact or BS
    // TODO: Randomly pick line
    // TODO: Create the view


    // Testing
    var view = {name: "Joe", say_hello: function(){ return "hello" }};    
    var html = mustache.to_html(template, view);

    res.end(html); // Write response
}).listen(8080);


