const qs = require('querystring');
const crypto = require('crypto');
//Credit to: https://emailregex.com/
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
/**
A function to handle updating a user's account
*/
function API(req,res,cookies,session,query,SessionHandler,db) {
	console.log("UPDATE ACCOUNT")
	if (req.method === 'POST' && session && session.userId) {
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
		  	if (isEmailValid(postData['uname']) && isPasswordValid(postData["psw"],postData["psw-confirm"])) {
		  		if (postData['uname'] == session.username) {
		  			//Email is the same, just update the password
		  			var salt = crypto.createHash('sha256').update(postData['uname'] + "There's a salt for that!").digest('hex');
    				var password = postData["psw"] + salt;
    				var hashedPass = crypto.createHash('sha256').update(password).digest('hex');
	    			
	    			db.updateUser(postData['uname'], hashedPass, salt, session.userId)
	    			.then(function(results) {
	    				//user should be updated, make sure the session object gets informed of the change
	    				session.username = postData['uname'];
	    				//Ensure the Session handler updates the cookie
	    				SessionHandler.updateSession(cookies,session);
	    				//Redirect back to account
	    				redirect(req,res,"/account");
	    			})
	    			.catch(function(err) {
	    				console.log(err);
	    				sendError(res,500,"Sorry, something went wrong when processing your request.");
	    			})
		  		}
		  		else {
		  			//need to update the email
		  			//First check if the new email exists in the database
		    		db.checkUser(postData['uname'])
		    		.then(function(results) {
			    		if (results && results.length === 0) {
			    			//that email is NOT in use, free to update to the new email
			    			var salt = "TAHFT_Sombrero";
		    				var password = postData["psw"] + salt;
		    				var hashedPass = crypto.createHash('sha256').update(password).digest('hex');
			    			
			    			db.updateUser(postData['uname'], hashedPass, salt, session.userId)
			    			.then(function(results) {
			    				//user should be updated, make sure the session object gets informed of the change
			    				session.username = postData['uname'];
			    				//Ensure the Session handler updates the cookie
			    				SessionHandler.updateSession(cookies,session);
			    				//Redirect back to account
			    				redirect(req,res,"/account");
			    			})
			    			.catch(function(err) {
			    				console.log(err);
			    				sendError(res,500,"Sorry, something went wrong when processing your request.");
			    			})
			    		}
			    		else {
			    			//user exists
			    			sendError(res,200,"Sorry, but that email is already in use.");
			    		}
			    	})
			    	.catch(function(err) {
			    		console.log(err);
			    		sendError(res,500,"Sorry, something went wrong when processing your request.");
			    	});
		  		}
		  	}
		  	else {
		  		//invalid email, let the user know.
		  		sendError(res,200,"Sorry, but your email or password is invalid.");
		  	}
		});
	}
	else {
		sendError(res,500,"Sorry, something went wrong when processing your request.");
	}
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
function isPasswordValid(pass,passConfirm) {
	var isValid = true;

	if (!pass || !passConfirm || pass !== passConfirm || !pass.length || pass.length < 10 || pass.length > 1024) {
		isValid = false;
	}

	console.log("IS PASSWORD VALID: ",isValid);

	return isValid;
}

function redirect(req,res,url) {
	res.writeHead(307, { Location: url });
	res.end();
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