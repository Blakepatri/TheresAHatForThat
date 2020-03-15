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
		var sessionCookieString = cookies.get('TAHFT');
		var sessionCookie = null;
		var session = null;

		if (sessionString) {
			//Decrypt the cookie into a JSON object
			sessionCookie = decryptSession(sessionCookie);
		}
		
		//User ID is something that MUST be set for this. If it is not then the session has been compromised somehow, return null.
		if (sessionCookie && sessionCookie.userID) {
			//session currently loaded in memory, grab it from there
			if (this.sessions[userID]) {
				session = this.sessions[userID];
			}
			else {
				//GET SESSION FROM DATABASE
			}
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
			//Encrypt the session to be sent back
			cookies.set("THAFT",encryptSession(newSession));
			return true;
		}
		else {
			return false;
		}
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