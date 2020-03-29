const qs = require('querystring');
//Credit to: https://emailregex.com/
const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

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
		    }
		    else {
		    	regError = true;
		    }
		});
	}
	else {

	}
}

//A function to check if an email is valid or not, returns true if valid, false otherwise
function isEmailValid(email) {
    var isValid = true;

    //Check if the string exists, if there is a length, and length constraints
    if (!email || !email.length || email.length < 0 || email.length > 254) {
        isValid = false;
    }
    //<> are not valid email address chars, and could open some things to cross site attacks
    else if (email.indexOf(">") > -1 || email.indexOf("<") > -1) {
        isValid = false;
    }
    //Check this complicated regular expression

    return isValid;
}

//Checks if the password is valid, returns true if it is, false otherwise
function isValidPassword(pass,passConfirm) {
	var isValid = true;

	if (!pass || !passConfirm || pass !== passConfirm || pass.length < 10) {
		isValid = false;
	}
	return isValid;
}

//Should always be API so the server can call it
module.exports.API = API;