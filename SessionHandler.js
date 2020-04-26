/**
A class for handling session information
*/
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Session = require(path.join(__dirname,'Session.js'));

const algorithm = 'aes-256-cbc';
const encryptionConfig = path.join(__dirname,"config","encryption.json");

//Options for cookie security
const cookieOptions = {
	"maxAge":(1000 * 60 * 60),//value in milliseconds, expires after 30 minutes
	"httpOnly":true,//Dont allow JS to modify the cookie
	"overwrite":true//Overwrite cookies of the same name
};

//How often the server should check for inactive sessions in milliseconds
const checkInactivePeriod = 1000 * 60 * 30; //30 minutes
//How long a session can be unused before getting removed in milliseconds
const inactiveTimeLength = 1000 * 60 * 60; //60 minutes

class SessionHandler {
	constructor() {
		//Read the session key from the file
		fs.readFile(encryptionConfig, 'utf8', (err,data) => {this.setEncryptionKey(err,data)});
		//Store the most recent sessions in memory
		this.sessions = {};
		//The interval that regularly checks for inactive sessions
		this.checkInactiveInterval = setInterval(() => {this.checkInactiveSessions();},checkInactivePeriod);
	}

	setEncryptionKey(err,data) {
		if (err) {
			throw err;
		}

		data = JSON.parse(data);

		if (data.SessionKey) {
			this.SessionKey = data.SessionKey;
		}
		else {
			throw "Error, no key found for encrypting session data.";
		}
	}

	//Start a new session, returns true if succesful, false otherwise
	//ipAddr and useragent are used to check against spoofing
	startSession(cookies,userId,username,admin,ipAddr,useragent) {
		var newSession = null;

		if (!admin) {
			admin = 0;
		}

		try {
			newSession = new Session(userId,username,admin,ipAddr,useragent);
		}
		catch(err) {
			console.log("Error creating session: ",err);
			newSession = null;
		}
		
		if (newSession) {
			//Encrypt the session to be sent back, only the id, userId, timestamp and username needs to be sent with the cookie.
			//Everything else can be cached server side.
			this.setCookie(cookies,newSession);
			this.sessions[newSession.id] = newSession;
			return true;
		}
		else {
			return false;
		}
	}

	//Update the session cookie with the current session values
	updateSession(cookies,session) {
		if (!session || !cookies || !session.userId) {
			return false;
		}

		session.last = Date.now();
		this.setCookie(cookies,session)
	}

	//Set a the cookie to be sent with the browser
	setCookie(cookies,session) {
		try {
			cookies.set("TAHFT",this.encryptSession(session),cookieOptions);
		}
		catch(err) {
			console.log("Something went wrong setting a cookie.");
			console.log(err);
		}
	}

	//Encrypt the session
	encryptSession(session) {
		var sessionObj = {
			"id":session.id,
			"userId":session.userId,
			"username":session.username,
			"last":session.last
		};
		var sessionJSON = JSON.stringify(sessionObj);
		var cipher = crypto.createCipher('aes-256-cbc',this.SessionKey);
		var sessionString = cipher.update(sessionJSON,'utf8','base64');
		sessionString += cipher.final('base64');

		return sessionString;
	}

	//Decrypt and parse session info sent from a user, returns null if there is an error.
	getSession(req,res,cookies) {
		var sessionCookieString = cookies.get('TAHFT');
		var sessionCookie = null;
		var session = null;

		if (sessionCookieString) {
			//Decrypt the cookie into a JSON object
			sessionCookie = this.decryptSession(sessionCookieString);
		}
		
		//id and User ID MUST be set for this. If it not then the session has been compromised somehow, return null.
		if (sessionCookie && sessionCookie.id && sessionCookie.userId) {
			var sessionID = sessionCookie.id;
			//session currently loaded in memory, grab it from there and refresh the last accessed time
			if (this.sessions[sessionCookie.id]) {
				session = this.sessions[sessionCookie.id];
				session.last = Date.now();
			}
		}

		console.log(session);

		//Check if the user's data matches what is stored.
		//checkSession will end the session if something is wrong with it
		if (session && !this.checkSession(req,res,cookies,session)) {
			session = null;//Session invalid, return null
		}

		return session;
	}

	//Decrypt the session. Returns an object or null if there was an error parsing it
	decryptSession(sessionString) {
		var session = null;
		try {
			var decipher = crypto.createDecipher('aes-256-cbc',this.SessionKey);
			var decipheredString = decipher.update(sessionString,'base64','utf8');
			decipheredString += decipher.final('utf8');
			session = JSON.parse(decipheredString);
		}
		catch(err) {
			console.log("There was an error decrypting a session cookie. It might have been tampered with.",decipheredString);
			console.log(err);
			session = null;
		}

		return session;
	}

	//Called from UserLogout.js, clears the cookie, deletes session object
	endSession(req,res,cookies,session) {
		if (session) {

			//Delete the session object
			delete this.sessions[session.id];
			session = undefined;
		}

		//Clear the cookie
		cookies.set("TAHFT"," ",cookieOptions);
	}

	//Check all sessions for old ones
	checkInactiveSessions() {
		var currentTime = Date.now();
		for(var key in this.sessions) {
			if ((this.sessions[key].last + inactiveTimeLength) < currentTime) {
				console.log("Cleaning up old session:",this.sessions[key].username);
				try {
					delete this.sessions[key];
				}
				catch(err) {
					console.log("Error deleting session",err);
				}
			}
		}
	}

	//Check the integrity of the session to see if it matches what we have stored
	//If something is weird end the session
	checkSession(req,res,cookies,session) {
		var validSession = true;
		if (req.headers['user-agent'] != session.useragent) {
			this.endSession(req,res,cookies,session);
			validSession = false;
		}

		return validSession;
	}
}

module.exports = SessionHandler;