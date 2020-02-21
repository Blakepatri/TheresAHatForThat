/**
A node based HTTP and IRC server, currently only supports WebSockets

constructor:  port, logging, routing, localOnly
	INT port: port the HTTP server will be listening on. Not implemented.
	INT logging: level of logging to the Node console, 0 for bare minimum and initialization, 1 for error, 2 for warning, 3 for request URLs, 4 for request data 
	OBJECT routing: the object that holds the routing information for serving files, and responding to requests. The object KEYS are valid request URLs
	BOOL localOnly: if true will only respond to requests from localhost or 127.0.0.1
*/

//Node modules
const http = require("http");
const fs = require('fs');
const path = require('path');
const directory = __dirname + "/"; //The directory of this file
const pageDirectory = directory + "pages/";//Directory of the individual page renderers
const PageRenderer = require(__dirname + "/PageRenderer.js");//Primary page renderer, combines nav, pages, and the footer.
const configDirectory = __dirname + "/config/";

//Navigation element files
const navElem = "nav.js";
const footerElem = "footer.js";

class Server {
	constructor(port, logging, routing, localOnly) {
		//The port the HTTP server listens on
		if (!port) {
			this.port = 80;
		}
		else {
			this.port = port;
		}

		//Logging level
		if (!logging) {
			this.logging = 0;
		}
		else {
			this.logging = logging;
		}

		//Routing information object. The keys should be valid URLs
		/*Example:
		{
			"/": {
				"title":"There's a Hat For That",
				"file":"Home.js"
			},
			"/login": {
				"title":"Login",
				"file":"Login.js"
			}
		}
		*/
		if (!routing || (typeof routing !== "object") && (typeof routing !== "OBJECT") && (typeof routing !== "Object")) {
			throw "Error initializing HTTP server, invalid routing information passed. Routing info should be an OBJECT. Type is currently: " + typeof routing;
		}
		else {
			this.routing = routing;
		}

		if (localOnly) {
			this.localOnly = true;
		}
		else {
			this.localOnly = false;
		}

		this.initPages();
		this.initAPI();
		this.initHTTPServer();
		this.initHTTPErrorCodes();
	}

	//Initialize the page renderers
	initPages() {
		this.log(0,"Beginning page rendering init.");
		//Primary page renderer
		this.PageRenderer = new PageRenderer(navElem,footerElem,this.routing.pages);
		for(var page in this.routing.pages) {
			this.log(0,"Page found: " + page);
			var currentPage = this.routing.pages[page];
			currentPage.render = require(pageDirectory + currentPage.file).render;
		}

		this.log(0,"Finished page rendering init.");
	}

	//Initializae the routing of the API
	initAPI() {
		this.log(0,"Beginning API init.");
		this.log(0,"Finished API init.");
	}

	//Initialize the server
	initHTTPServer() {
		this.log(0,"Beginning HTTP server init","Port: ",this.port,"Logging level: ",this.logging);
		this.HTTP = http.createServer((request, response) => {
			this.HTTPResponse(request,response);
		});
		//Begin listening for requests
		this.HTTP.listen(this.port);
		this.log(0,"Finished HTTP server init");
	}

	//The error messages the server will respond with
	initHTTPErrorCodes() {
		//HTTP error codes and pages
		this.errorCodes = {};
		var errorCodes = this.errorCodes;
		fs.readFile(configDirectory + "errorCodes.json", 'utf8', (err,data) => {
			this.setHTTPErrorCodes(err,data);
		});
	}

	setHTTPErrorCodes(err,data) {
		if (err) {
			throw err;
		}

		this.errorCodes = JSON.parse(data);
	}

	//Handler for HTTP requests
	HTTPResponse(request, response) {
		//Ensure things are coming from the local machine
		if (this.localOnly && request.headers.host !== "localhost" && request.headers.host !== "127.0.0.1") {
			console.log("Forbidden request from: " + request.headers.host);
			this.HTTPError(request,response,403);
			return;
		}
		//ignore favicon requests, not supported yet
		else if (request.url == "\\favicon.ico" || request.url == "/favicon.ico" || request.url == "favicon.ico") {
			this.HTTPError(request,response,404);
			return;
		}

		this.log(3,request.url);

		//Check if the request should actually be routed to a page
		if (this.routing.pages[request.url]) {
			var page = this.routing.pages[request.url];
			console.log("Routing information!:",page);

			var renderingError = false;
			var pageData;
		    try {
		    	pageData = this.PageRenderer.render(page);
		    }
		    catch(err) {
		    	renderingError = true;
		    	this.log(1,err);
		    }

		    if (!renderingError) {
		    	response.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
			    response.writeHead(200, {
			        'Content-Type': "text/html"
			    });
			    response.write(pageData);
			    response.end();
		    }
		    else {
		    	//something went wrong getting the page
		    	this.HTTPError(request,response,500);
		    }
		}
		//Check if it should be routed to the API
		else if (this.routing.api[request.url]) {

		}
		//No routing info, send 404
		else {
			this.HTTPError(request,response,404);
		}		
	}

	//Send back an HTTP serror message, code is the HTTP response code
	HTTPError(request,response,code) {
		response.writeHead(code, {'Content-Type': 'text/html'});
		response.write(this.errorCodes[code]);
		response.end();
	}

	//Log messages, first arguement should be the logging level, the rest are things to be logged.
	//All this function does is check the log level and pass it off to console.log
	log() {
		if (arguments[0] <= this.logging) {
			for (var i=1;i<arguments.length;i++) {
				console.log(arguments[i]);
			}
		}
	}
}

//Export so it can be used.
module.exports = Server;