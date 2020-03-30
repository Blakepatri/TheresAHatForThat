const qs = require('querystring');
const crypto = require('crypto');
//Credit to: https://emailregex.com/
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
/**
A function to handle users logging in
*/
function API(req,res,cookies,SessionHandler,db) {
	console.log("SessionHandler: ");
	console.log(SessionHandler);
	if (req.method === 'POST') {
		var body = [];
		req.on('data', (chunk) => {
		  	body.push(chunk);
		  	//There's no way an email and password should be taking that many bits, kill the connection.
		  	if (body.length > 5000) {
                req.connection.destroy();
		  	}
		}).on('end', () => {
		  	body = Buffer.concat(body).toString();
		  	var postData = qs.parse(body);

		  	//Check email and password even before bothering the database
		  	if (isEmailValid(postData['uname']) && postData["psw"]) {
		  		var salt = "TAHFT_Sombrero";
	    		var password = postData["psw"] + salt;
	    		var hashedPass = crypto.createHash('sha256').update(password).digest('hex');
	    		console.log("email: " + postData['uname']);
	    		console.log("hash: " + hashedPass);
	    		db.getUserForLogin(postData['uname'], hashedPass)
		    	.then(function(results) {
		    		if (results && results.length > 0) {
		    			//A user with the matching email and hash got returned, start the session and redirect them.
		    			var admin = 0;
		    			if (results[0].admin && results[0].admin !== "0" && results[0].admin !== 0) {
		    				admin = 1;
		    			}

		    			var sessionError = false;
		    			try {
							SessionHandler.startSession(cookies,results[0].userId,postData['uname'],admin);
						}
						catch(err) {
							console.log("There was an error starting a session: ",err);
							sessionError = true;
						}

						if (!sessionError) {
							console.log("User login: " + postData['uname']);
			    			res.writeHead(301, { Location: '/home' });
			    			res.end();
						}
						else {
							sendError(res,500,"Sorry, something went wrong when processing your request.");
						}
		    		}
		    		else {
		    			sendError(res,200,"Sorry, but your email or password is incorrect.");
		    		}
		    		
		    	})
		    	.catch(function(err) {
		    		console.log(err.code);
		    		sendError(res,500,"Sorry, something went wrong when processing your request.");
		    	});
		  	}
		  	else {
		  		//invalid email, let the user know.
		  		sendError(res,200,"Sorry, but your email or password is incorrect.");
		  	}
		});
	}
	else {
		sendError(res,500,"Sorry, something went wrong when processing your request.");
	}

	/*
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
	}*/
}

//Check if email is valid, returns true if it is, false otherwise
function isEmailValid(email) {
	var isValid = true;

	try {
		//Check if the string exists, if there is a length, and length constraints
	    if (!email || !email.length || email.length < 3 || email.length > 254) {
	        isValid = false;
	    }
	    //<> are not valid email address chars, and could open some things to cross site attacks,
	    else if (email.indexOf(">") > -1 || email.indexOf("<") > -1) {
	        isValid = false;
	    }
	    //Check this complicated regular expression, if no matches the email isn't valid
	    else if (!emailRegExp.test(email)) {
			isValid = false;
		}
	}
	catch(err) {
		console.log("Email validation error: ");
		console.log(err);
		isValid = false;
	}

    return isValid;
}

//Checks if the password is valid, returns true if it is, false otherwise
function isPasswordValid(pass) {
	var isValid = true;

	if (!pass || !pass.length || pass.length < 10 || pass.length > 1024) {
		isValid = false;
	}

	return isValid;
}

function sendError(res,code,message) {
	try {
		res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
	    res.writeHead(code, {
	        'Content-Type': "text/html"
	    });
	    res.write(message);
	    res.end();
	}
	catch(err) {
		console.log(err);
	}
}

module.exports.API = API;