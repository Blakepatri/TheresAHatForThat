/**
Main file for running everything, loads a few config files that need to be initialized before other things.
*/
console.log("There's a Hat For That Booting :>");
//Modules and imports
const Server = require("./Server.js");
const fs = require("fs");

const directory = __dirname + "/"; //The directory of this file
const configDirectory = directory + "config/";
const routingConfig = configDirectory + "routing.json";
const DBConfig = __dirname + "/config/database.json";

const serverPort = 80;//HTTP
const loggingLvl = 4;//Log everything

var HTTPServer;
var routingData;
var databaseInfo;

//Load the routing info
fs.readFile(routingConfig, 'utf8', function(err,data) {
	if (err) {
		console.log("Error loading routing information.");
		console.log(err);
		routingData = null;
	}

	try {
		routingData = JSON.parse(data);
	}
	catch(err) {
		console.log("Error parsing routing information.");
		console.log(err);
		routingData = null;
	}

	//Routing data is good, load the DB login info
	if (routingData) {
		loadDBConfig();
	}	
});

//Load the database info
function loadDBConfig() {
	fs.readFile(DBConfig, 'utf8', function(err,data) {
	if (err) {
		console.log("Error loading database information.");
		console.log(err);
		DBConfig = null;
	}

	try {
		databaseInfo = JSON.parse(data);
	}
	catch(err) {
		console.log("Error parsing database information.");
		console.log(err);
		databaseInfo = null;
	}

	if (databaseInfo) {
		initServer();
	}	
});
}

function initServer() {
    HTTPServer = new Server(serverPort,loggingLvl,routingData,databaseInfo);
	console.log("App init finished.");
}