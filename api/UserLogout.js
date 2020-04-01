/**
A function to handle logging users out
*/
function API(req,res,cookies,session,SessionHandler) {
	console.log("LOGGING USER OUT");
	SessionHandler.endSession(req,res,cookies);
}

//Should always be API so the server can call it
module.exports.API = API;