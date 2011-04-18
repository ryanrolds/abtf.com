var config = require("../config.js"); // Contains config information like port and file locations
var fs = require("fs");
var mustache = require("mustache"); // Template engine
var hash = require("hashlib");

var http = require('http');
var url = require('url');
var httpServer; // Holds the server

var facts = []; // Facts
var factLookup = {};
var template = ""; // Template

function startHttp() {
    if(httpServer != undefined || facts.length == 0 || template.length == 0) return;

    /* The http server */
    httpServer = http.createServer(function (req, res) {
	var fact; // Holds the fact
	var cookies = {}; // This will hold cookie data
	var prev = []; // Holds id of last x facts show
	
	/* Using a cookie to keep track of last x facts views */
	if(req.headers.cookie) { // If cookie set
	    req.headers.cookie.split(';').forEach(function(cookie) { // Split by ;
		var parts = cookie.split('='); // Divide it up in to key value pairs
		cookies[parts[0].trim()] = (parts[1] || '' ).trim(); // Store trimmed key/value
	    });
	}

	if(cookies.prev !== undefined) { // If prev is in the cookie
	    cookies.prev.split("|").forEach(function(prevId) { // Get the list from the cookie and turn in to ints
		prev.push(parseInt(prevId));
	    });
	}

	/* Facts can be directly linked to using <domain>/fact?hash=<md5(fact.id)> */
	if(req.url.length > 1) {
	    var urlObj = url.parse(req.url,true);

	    // If /fact and a valid hash then get the fact
	    if(urlObj.pathname == "/fact" && urlObj.query.hash !== undefined && urlObj.query.hash.length == 32 && factLookup[urlObj.query.hash] !== undefined) 
		fact = factLookup[urlObj.query.hash]; // Get that bitch
	}
	
	/* If not a directly linked fact then we randomly get one */
	if(fact === undefined) { // If a fact hasn't been gotten then get one
	    var f = function(g) { 
		var fact = facts[Math.floor(Math.random()*facts.length)];
		return (prev.indexOf(fact.id) == -1) ? fact : g(g);
	    };
	    fact = f(f);
	}

	/* Previous fact array maintence */
	if(prev.indexOf(fact.id) == -1) // If fact not already in array - this could happen if direct link refreshed several times
	    prev.push(fact.id); // Add the new fact to the prev array

	if(prev.length > 5) prev.shift(); // We are keeping track of the last 5 - shift off 6th item
    
	/* Get the page using mustache.js  */
	var html = mustache.to_html(template,{"fact":fact,"domain":config.domain,"encdomain":encodeURIComponent(config.domain),"tweet_hash":config.tweet_hash});

	/* Write header and send response */
	res.writeHead(200,{
	    'Set-Cookie': 'prev='+prev.join("|"),
	    'Content-Type': 'text/html'
	}); // Send headers
	res.end(html); // Write response
    });
    httpServer.listen(config.port);
    console.log("Started HTTP on port "+config.port);
};
function updateFacts() {
    console.log("Loading facts");
    fs.readFile(config.factFile,"utf8",function(error,data) {
	if(error) throw error;

	var newFacts = [];
	var newFactLookup = {};
	while(data.length > 0) {
	    var eol = data.indexOf("\n");
	    if(eol == -1) eol = data.length;
	    
	    try {
		var fact = JSON.parse(data.substring(0,eol));
	    } catch(e) {
		var fact = false;
	    }

	    if(fact != false) {
		// Post processing
		fact.hash = hash.md5(fact.id);
		fact.short = fact.fact.substr(0,130)+((fact.fact.length > 130) ? "...": "");
		// Add to array
		newFacts.push(fact);
		newFactLookup[fact.hash] = fact;
	    }
	    
	    data = data.substring(eol+1,data.length);	    
	}

	if(newFacts.length > 0) {
	    facts = newFacts;
	    factLookup = newFactLookup;
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

/* Load the facts and the template */
updateFacts(); 
updateTemplate()

/* We will be watching the facts file and template file for changes and reloading data on change */
fs.watchFile(config.factFile,function(curr,prev) {
    if(curr.mtime != prev.mtime) {
	updateFacts();
	console.log("Reloading facts");
    }
});
fs.watchFile(config.templateFile,function(curr,prev) {
    if(curr.mtime != prev.mtime) {
	updateTemplate();
	console.log("Reloading template");
    }
});