/**
A function to handle logging users out
*/
function API(req,res,cookies,session,query,SessionHandler) {
	SessionHandler.endSession(req,res,cookies,session);
	res.writeHead(307, { Location: '/home' });
	res.end();
}

//Should always be API so the server can call it
module.exports.API = API;