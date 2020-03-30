const qs = require('querystring');
const crypto = require('crypto');
//Credit to: https://emailregex.com/
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;

/**
A function to handle registering users
*/
function API(req,res,cookies,SessionHandler,db) {
	console.log("New user registration");
	var regError = false;

	//This should only ever be a POST
	if (req.method === 'POST') {
		var body = [];
		req.on('data', (chunk) => {
		  	body.push(chunk);
		  	//There's no way an email and password should be taking that many bits, kill the connection.
		  	if (body.length > 10000) {
                req.connection.destroy();
		  	}
		}).on('end', () => {
		  	body = Buffer.concat(body).toString();
		  	var postData = qs.parse(body);
		  	console.log(postData);

		    if (isEmailValid(postData["email"]) && isValidPassword(postData["psw"],postData["psw-confirm"])) {
		    	console.log("Email and password are valid");
		    	console.log(db.checkUser(postData["email"]));

		    	/*if (!db.checkUser(postData["email"])) {
		    		//User doesn't exist yet, create one
		    		//In an ideal world the salt would be unique to the user.
		    		var salt = "TAHFT_Sombrero";
		    		var password = postData["psw"] + salt;
		    		var hashedPass = crypto.createHash('sha256').update(password).digest('hex');
					db.addUser(postData["email"], hashedPass, salt, " ", " ");
		    	}
		    	else {
		    		console.log("Error, user already exists: " + postData["email"]);
		    		regError = true;
		    	}*/

		    	var salt = "TAHFT_Sombrero";
	    		var password = postData["psw"] + salt;
	    		var hashedPass = crypto.createHash('sha256').update(password).digest('hex');

		    	db.addUser(postData["email"], hashedPass, salt, " ", " ")
		    	.then(function(results) {
		    		console.log(results);
		    	})
		    	.catch(function(err) {
		    		console.log(err.code);
		    		if (err.code === "ER_DUP_ENTRY") {
		    			console.log("Error, user trying to register multiple times: " + postData["email"]);
		    			sendError(res,200,"Sorry, but that email is already in use");
		    		}
		    		else {

		    		}
		    	});
		    }
		    else {
		    	sendError(res,200,"Sorry, but that email or password is not valid");
		    }
		});
	}
}

//A function to check if an email is valid or not, returns true if valid, false otherwise
function isEmailValid(email) {
	var isValid = true;

	try {
		//Check if the string exists, if there is a length, and length constraints
	    if (!email || !email.length || email.length < 0 || email.length > 254) {
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
function isValidPassword(pass,passConfirm) {
	var isValid = true;

	if (!pass || !passConfirm || pass !== passConfirm || !pass.length || pass.length < 10 || pass.length > 1024) {
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

//Should always be API so the server can call it
module.exports.API = API;