/**
A node based HTTP server

constructor:  port, logging, routing, localOnly
	INT port: port the HTTP server will be listening on. Not implemented.
	INT logging: level of logging to the Node console, 0 for bare minimum and initialization, 1 for error, 2 for warning, 3 for request URLs, 4 for request data 
	OBJECT routing: the object that holds the routing information for serving files, and responding to requests. The object KEYS are valid request URLs
	BOOL localOnly: if true will only respond to requests from localhost or 127.0.0.1, WILL BE DISCONTINUED
*/

//Node modules
const http = require("http");
const url = require("url");
const fs = require('fs');
const path = require('path');
const Cookies = require('cookies');
const qs = require('querystring');

//Various handler classes
const PageRenderer = require(path.join(__dirname,"PageRenderer.js"));//Primary page renderer, combines nav, pages, and the footer.
const FileHandler = require(path.join(__dirname,"FileHandler.js"));//Gets read streams for files as well as other information such as the content type
const SessionHandlerFile = require(path.join(__dirname,"SessionHandler.js"));//Handles starting,stopping, and checking sessions
const databaseHandler = require(path.join(__dirname,"databaseHandler.js"));//Database queries
const Hats = require(path.join(__dirname,"Hats.js"));//Hats.

//Configuration
const pageDirectory = path.join(__dirname,"pages");//Directory of the individual page renderers
const APIDirectory = path.join(__dirname,"api");//Directory of the API functions
const configDirectory = path.join(__dirname,"config");
//Navigation element files
const navElem = "nav.js";
const footerElem = "footer.js";

class Server {
	constructor(port, logging, routing, databaseInfo) {
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

		//Routing information object. The keys should be valid URL paths
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
		if (!routing || (((typeof routing) !== "object") && ((typeof routing) !== "OBJECT") && (typeof routing !== "Object"))) {
			throw "Error initializing HTTP server, invalid routing information passed. Routing info should be an OBJECT. Type is currently: " + (typeof routing);
		}
		else {
			this.routing = routing;
		}

		if (!databaseInfo) {
			throw "Database info not loaded properly";
		}
		else {
			this.dbInfo = databaseInfo;
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
		//Loop through the other pages and require their render functions
		for(var page in this.routing.pages) {
			this.log(0,"Page found: " + page);
			var currentPage = this.routing.pages[page];
			currentPage.render = require(path.join(pageDirectory,currentPage.file)).render;
		}

		this.log(0,"Finished page rendering init.");
	}

	//Initialize the routing of the API
	initAPI() {
		this.log(0,"Beginning API init.");
		//The class that handles serving files over HTTP
		this.FileHandler = new FileHandler();
		//The class that handles sessions
		this.SessionHandler = new SessionHandlerFile();
		//The class that handles database queries
		this.db = new databaseHandler(this.dbInfo);
		//The class that handles storing keeping track of hats, give it the DB so it can add, edit, and delete hats
		this.Hats = new Hats(this.db);
		//Create the connections, and once that's done load the hats
		this.db.createConnPool()
		.then(function(results) {
			console.log("DB setup complete, beginning to load hats.");
			this.Hats.loadHats(this.db);
		}.bind(this))
		.catch(function(err) {
			console.log(err);
			throw err;
		}.bind(this));

		//Essentially every API route has an API() function that gets called when a request is routed to it. The API() function is expected to handle
		for (var api in this.routing.api) {
			this.log(0,"API found: " + api);
			var currentAPI = this.routing.api[api];
			currentAPI.API = require(path.join(APIDirectory,currentAPI.file)).API;
		}
		this.log(0,"Finished calling API init. functions, some may still be doing stuff in the background.");
	}

	//Initialize the server
	initHTTPServer() {
		this.log(0,"Beginning HTTP server init","Port: ",this.port,"Logging level: ",this.logging);
		this.HTTP = http.createServer((request, response) => {
			this.HTTPRequest(request,response);
		});

		//Begin listening for requests
		this.HTTP.listen(this.port);
		this.log(0,"Finished HTTP server init");
	}

	//The error messages the server will respond with
	initHTTPErrorCodes() {
		//HTTP error codes and pages
		this.errorCodes = {};
		fs.readFile(path.join(configDirectory,"errorCodes.json"), 'utf8', (err,data) => {
			this.setHTTPErrorCodes(err,data);
		});
	}

	//Callback for initHTTPErrorCodes, all this does is parse the JSON into an object.
	setHTTPErrorCodes(err,data) {
		if (err) {
			throw err;
		}

		this.errorCodes = JSON.parse(data);
	}

	//Handler for HTTP requests
	HTTPRequest(request, response) {
		var parsedURL = url.parse(request.url)
		var URLPath = parsedURL.pathname;
		var query;
		try {
			query = qs.parse(parsedURL.query);
		}
		catch(err) {
			query = null;
		}
		this.log(3,URLPath);

		//Check if the request should actually be routed to a page
		if (this.routing.pages[URLPath]) {
			var cookies = new Cookies(request,response);
			var session = this.SessionHandler.getSession(request,response,cookies);
			var page = this.routing.pages[URLPath];
			this.log(4,"Page information:",page);
			if (page.loggedIn && !session) {
				//If the page requires a user to be logged in send them to /login
				this.HTMLResponse(request,response,this.routing.pages["/login"],session,query);
			}
			else {
				//otherwise send them to the page
				this.HTMLResponse(request,response,page,session,query);
			}
		}
		//Check if it should be routed to the API
		else if (this.routing.api[URLPath]) {
			var api = this.routing.api[URLPath];
			var cookies = new Cookies(request,response);
			var session = this.SessionHandler.getSession(request,response,cookies);
			if (api.loggedIn && !session) {
				//Check if the user needs to be logged in to access this route, if they do send them off to login
				this.HTMLResponse(request,response,this.routing.pages["/login"],session,query);
			}
			else if ((!session && api.admin) || (session && api.admin > session.admin)) {
				//User not permitted to see this page, send out a 404
				this.HTTPError(request,response,404);
			}
			else {
				//Route the API request
				this.log(4,"API information:",api);
				//Call the API function from the API object, Cookies, session, SessionHandler, databaseHandler, and hats do not necessarily need to be handled by the API
				try {
					api.API(request,response,cookies,session,query,this.SessionHandler,this.db,this.Hats.hats);
				}
				catch(err) {
					console.log(err);
					this.HTTPError(request,response,500);
				}
				
			}
		}
		//Check if it should try and serve a file or image
		else if (URLPath.search(/^(\/images\/)/i) > -1) {
			this.FileResponse(request,response,URLPath,"images");
		}
		else if (URLPath.search(/^(\/scripts\/)/i) > -1) {
			this.FileResponse(request,response,URLPath,"scripts");
		}
		else if (URLPath.search(/^(\/css\/)/i) > -1) {
			this.FileResponse(request,response,URLPath,"css");
		}
		else if (URLPath.search(/^(\/files\/)/i) > -1) {
			this.FileResponse(request,response,URLPath,"files");
		}
		//No routing info, send 404
		else {
			this.HTTPError(request,response,404);
		}		
	}

	//A standard web page response
	HTMLResponse(request,response,page,session,query) {
		var renderingError = false;
		var pageData = "";
	    try {
	    	//Use the PageRenderer to generate the page itself, pass in the hats so pages can use that data to render those, as well as a query object
	    	pageData = this.PageRenderer.render(page,session,this.Hats.hats,query);
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

	//Send a file back, the handler will guess the content type
	FileResponse(request,response,URLPath,fileFolder) {
		var fileName = path.basename(URLPath);
		var file = this.FileHandler.getFile(fileName,fileFolder);
		this.log(5,"File response: ",file);
		if (file && file.readStream) {
			response.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
			response.writeHead(200, {
		        'Content-Type': file.contentType,
		        'Content-Length': file.size
		    });

			try {
				file.readStream.pipe(response);
			}
			catch(err) {
				this.log(1,err);
			}
		}
		else {
			//No file, or there was an error reading it
			this.HTTPError(request,response,404);
		}
	}

	//Send back an HTTP error message, code is the HTTP response code
	HTTPError(request,response,code) {
		try {
			//Set the headers including the code.
			response.writeHead(code, {'Content-Type': 'text/html'});
			//Write a message to go with the error, contained in config/errorCodes.json
			response.write(this.errorCodes[code]);
			response.end();
		}
		catch(err) {
			console.log(err);
		}
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

module.exports = Server;