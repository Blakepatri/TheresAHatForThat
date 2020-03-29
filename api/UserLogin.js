/**
A function to handle users logging in and create a sessions
*/
function API(req,res,cookies,SessionHandler) {
	//VERIFY PASSWORD DATA

	//GET USERID, name, and admin level, default 0;
	var userID = Math.round(Math.rand() * 10000);
	var username = "TEST";

	var sessionError = false;

	try {
		SessionHandler.startSession(cookies,userID,username);
	}
	catch(err) {
		console.log("There was an error starting a session: ",err);
		sessionError = true;
	}

	if (!sessionError) {
		res.writeHead(200, {'Content-Type': 'text/html'});
		res.end();
	}
	else {
		res.writeHead(401, {'Content-Type': 'text/html'});
		//Write a message to go with the error, contained in config/errorCodes.json
		res.end();
	}
}

module.exports.API = API;