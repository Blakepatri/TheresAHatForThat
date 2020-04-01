/**
A class for handling session information
*/
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const Session = require(path.join(__dirname,'Session.js'));

const algorithm = 'aes-256-cbc';
const encryptionConfig = path.join(__dirname,"config","encryption.json");

class SessionHandler {
	constructor() {
		//Read the session key from the file
		fs.readFile(encryptionConfig, 'utf8', (err,data) => {this.setEncryptionKey(err,data)});
		//Store the most recent sessions in memory
		this.sessions = {};
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
	startSession(cookies,userId,username,admin) {
		var newSession = null;

		if (!admin) {
			admin = 0;
		}

		if (this.sessions[userId]) {
			//This user is already logged in, don't know why a new session is trying to be started
			newSession = this.sessions[userId];
			newSession.last = Date.now();
		}
		else {
			try {
				newSession = new Session(userId,username,admin);
			}
			catch(err) {
				console.log("Error creating session: ",err);
				newSession = null;
			}
		}
		
		if (newSession) {
			//Encrypt the session to be sent back, only the userId and username needs to be sent with the cookie.
			//Everything else can be cached server side.
			cookies.set("TAHFT",this.encryptSession(newSession.userId,newSession.username));
			this.sessions[userId] = newSession;
			return true;
		}
		else {
			return false;
		}
	}

	//Encrypt the session
	encryptSession(userId,username) {
		var sessionObj = {
			"userId":userId,
			"username":username
		};
		var sessionJSON = JSON.stringify(sessionObj);
		var cipher = crypto.createCipher('aes-256-cbc',this.SessionKey);
		var sessionString = cipher.update(sessionJSON,'utf8','base64');
		sessionString += cipher.final('base64');

		return sessionString;
	}

	//Decrypt and parse session info sent from a user, returns null if there is an error.
	getSession(req,res,cookies) {
		console.log("GETTING SESSION: ");
		var sessionCookieString = cookies.get('TAHFT');
		console.log(sessionCookieString);
		var sessionCookie = null;
		var session = null;

		if (sessionCookieString) {
			//Decrypt the cookie into a JSON object
			sessionCookie = this.decryptSession(sessionCookieString);
		}
		
		//User ID is something that MUST be set for this. If it is not then the session has been compromised somehow, return null.
		if (sessionCookie && sessionCookie.userId) {
			var userId = sessionCookie.userId;
			//session currently loaded in memory, grab it from there and refresh the last accessed time
			if (this.sessions[userId]) {
				session = this.sessions[userId];
				session.last = Date.now();
			}
			else {
				//GET SESSION FROM DATABASE
			}
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

	//Called from UserLogout.js
	endSession(req,res,cookies) {
		var session = getSession(req,res);

		if (session) {
			cookies.set("THAFT","");
			this.sessions[session.id] = null;
			//CLEAR FROM DATABASE IF STORED
			return true;
		}
		else {
			return false;
		}
	}

	//Check the integrity of the session to see if it matches what we have stored
	checkSession(req,resp) {

	}
}

module.exports = SessionHandler;