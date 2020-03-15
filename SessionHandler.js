/**
A class for handling session information
*/
const crypto = require('crypto');
const fs = require('fs');
const Session = require(__dirname + '/Session.js');

const algorithm = 'aes-256-cbc';
const encryptionConfig = "config/encryption.json"

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

	//Decrypt and parse session info sent from a user, returns null if there is an error.
	getSession(req,res) {
		var sessionCookie = decryptSession(sessionString);

		if (sessionCookie.userID) {

		}
		//User ID is something that MUST be set for this. If it is not then the session has been compromised somehow, return null.
		else {
			session = null;
		}

		return session;
	}

	encryptSession(session) {

		return sessionString;
	}

	//Returns an object
	decryptSession(sessionString) {

		return session;
	}

	//Start a new session, returns true if succesful, false otherwise
	startSession(cookies,userID,username) {
		var newSession = null;
		if (this.sessions[userID]) {
			//This user is already logged in, don't know why a new session is trying to be started
			session = this.sessions[userID];
			session.last = Date.now();
		}
		else {
			try {
				newSession = new Session(userID,username,0);
			}
			catch(err) {
				console.log("error creating session");
				newSession = null;
			}
		}
		
		if (newSession) {
			cookies.set("THAFT",encryptSession(newSession));
			return true;
		}
		else {
			return false;
		}
	}

	//Called from UserLogout.js
	endSession(request,response) {

	}

	//Check the integrity of the session to see if it matches what we have stored
	checkSession(request,response) {

	}
}

module.exports = SessionHandler;