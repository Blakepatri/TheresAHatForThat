/**
A class to handle users logging in and create a sessions
*/
function API(req,res,cookies,SessionHandler) {
	//VERIFY PASSWORD DATA

	//GET USERID, name, and admin level, default 0;
	var userID = Math.round(Math.rand() * 10000);
	var username = "TEST";

	SessionHandler.startSession(cookies,userID,username);
}

module.exports.API = API;