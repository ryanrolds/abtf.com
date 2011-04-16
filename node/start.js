var config = require("./config.js"); // Contains config information like port and file locations
var fs = require("fs");
var mustache = require("mustache"); // Template engine

var http = require('http');
var httpServer; // Holds the server

var facts = []; // Facts
var template = ""; // Template

function startHttp() {
    if(httpServer != undefined || facts.length == 0 || template.length == 0) return;

    console.log("Starting HTTP on port "+config.port);
    // Startup server
    httpServer = http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'}); // Send headers
	// Decide if fact or BS
	var fact = facts[Math.floor(Math.random()*facts.length)];
    
	// TODO: Create the view
	var view = {"factNum":fact.id,"fact":fact.fact,"fact_short":fact.fact.substr(0,130)+((fact.fact.length > 130) ? "...": ""),"domain":config.domain,"tweet_hash":config.tweet_hash}; 
	var html = mustache.to_html(template, view);

	res.end(html); // Write response
    });

    httpServer.listen(config.port);
};
function updateFacts() {
    console.log("Loading facts");
    fs.readFile(config.factFile,"utf8",function(error,data) {
	if(error) throw error;

	var newFacts = [];
	while(data.length > 0) {
	    var eol = data.indexOf("\n");
	    if(eol == -1) eol = data.length;
	    
	    try {
		var fact = JSON.parse(data.substring(0,eol));
	    } catch(e) {
		var fact = false;
	    }

	    if(fact != false) 
		newFacts.push(fact);
	    
	    data = data.substring(eol+1,data.length);	    
	}

	if(newFacts.length > 0) {
	    facts = newFacts;
	    console.log(facts.length+" facts found");

	    if(httpServer == undefined) // If server has been setup then try to start it
		startHttp();
	} else {
	    console.log("No facts found");
	}
    });
};
function updateTemplate() {
    console.log("Loading template");
    fs.readFile(config.templateFile,'utf8',function(error,data) {
	if(error) throw error;

	template = data;

	if(httpServer == undefined) // If server hasn't been setup
	    startHttp();
    });
}

updateFacts();
updateTemplate()

// Watch fact file for changes and reload facts on change
fs.watchFile(config.factFile,function(curr,prev) {
    if(curr.mtime != prev.mtime) {
	updateFacts();
	console.log("Reloading facts");
    }
});

// Watch template file and load in new template on change
fs.watchFile(config.templateFile,function(curr,prev) {
    if(curr.mtime != prev.mtime) {
	updateTemplate();
	console.log("Reloading template");
    }
});