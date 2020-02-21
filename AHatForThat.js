/**
Main file for running everything
*/
console.log("There's a Hat For That Booting :>");

const Server = require("./Server.js");
const fs = require("fs");

const directory = __dirname + "/"; //The directory of this file
const configDirectory = directory + "config/";

const routingConfig = configDirectory + "routing.json";
const serverPort = 80;//HTTP
const loggingLvl = 4;//Log everything

var HTTPServer;//Object holding the HTTP server

//Load the routing info
fs.readFile(routingConfig, 'utf8', function(err,data) {
	if (err) {
		throw err;
	}

	initServer(JSON.parse(data));
});

function initServer(routing) {
    HTTPServer = new Server(serverPort,loggingLvl,routing,true);
	console.log("App init finished.");
}