var config = require("./config.js");
var fs = require("fs");
var lineReader = require("line-reader");
var mustache = require("mustache");

// Will hold our "facts"
var facts = [];

// Load facts
facts = getFactsFromFile("facts.txt");

// Watch facts and BS files for changes and reload facts on change
fs.watchFile("facts.txt",function(curr,prev) {
    if(curr.mtime != prev.mtime) {
	facts = getFactsFromFile("facts.txt");
	console.log("Reloading facts");
    }
});

var template = "";
// TODO: Load template
var loadTemplate = function() {
    fs.readFile('fact.tpl','utf8',function(err,data) {
	if(err) throw err;

	template = data;
    });
}
loadTemplate();

fs.watchFile('fact.tpl',function(curr,prev) {
    if(curr.mtime != prev.mtime) {
	loadTemplate();
	console.log("Reloading template");
    }
});

//var template = "{{fact}}";

var http = require('http');
// Startup server
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); // Send headers
    // Decide if fact or BS
    var fact = facts[Math.floor(Math.random()*facts.length)];
    
    // TODO: Create the view
    var view = {"factNum":fact.id,"fact":fact.fact,"fact_short":fact.fact.substr(0,130)+((fact.fact.length > 130) ? "...": ""),"domain":config.domain,"tweet_hash":config.tweet_hash}; 
    var html = mustache.to_html(template, view);

    res.end(html); // Write response
}).listen(config.port);

function getFactsFromFile(file){
    var incoming = [];

    lineReader.eachLine(file, function(line) {
	if(line.length > 0) {
	    var fact = JSON.parse(line);
	    if(fact !== false && fact.show == true)
		incoming.push(fact)
	}
    });
    
    return incoming;
}
