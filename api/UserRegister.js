/**
A function to handle registering users
*/
function API(req,res,cookies,SessionHandler,db) {
	console.log("New user registration");
	//First check if the email exists in the database
	if (!db.userExists()) {

	}
	else {

	}
}

//Should always be API so the server can call it
module.exports.API = API;