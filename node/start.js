var fs = require("fs");
var lineReader = require("line-reader");
var mustache = require("mustache");

// Will hold our "facts"
var facts = [];
var bullshit = [];

// Load facts
facts = getFactsFromFile("facts.txt");
// Load bullshit
bullshit = getFactsFromFile("bullshit.txt");

// Watch facts and BS files for changes and reload facts on change
fs.watchFile("facts.txt",function(curr,prev) {
    if(curr.mtime != prev.mtime) {
	facts = getFactsFromFile("facts.txt");
	console.log("Reloading facts");
    }
});
fs.watchFile("bullshit.txt",function(curr,prev) {
    if(curr.mtime != prev.mtime) {
	bullshit = getFactsFromFile("bullshit.txt");
	console.log("Reloading bullshit");
    }
});

// TODO: Load template
var template = "{{fact}}";

var http = require('http');
// Startup server
http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); // Send headers
    // Decide if fact or BS
    var selectedArray = (Math.floor(Math.random()*10) < 9) ? facts : bullshit;

    // Randomly pick line
    var selectedFact = selectedArray[Math.floor(Math.random()*selectedArray.length)];
    
    // TODO: Create the view
    var view = {fact: selectedFact};    
    var html = mustache.to_html(template, view);

    res.end(html); // Write response
}).listen(8080);

function getFactsFromFile(file){
    var incoming = [];

    lineReader.eachLine(file, function(line) {
	if(line.length > 0)
	    incoming.push(line)
    });
    
    return incoming;
}