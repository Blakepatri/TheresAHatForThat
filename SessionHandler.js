/**
A class for handling session information
*/
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const encryptionConfig = "config/encryption.json"
const fs = require('fs');

class SessionHandler {
	constructor() {
		//Read the session key from the file
		fs.readFile(encryptionConfig, 'utf8', (err,data) => {this.setEncryptionKey(err,data)});
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

	//Decrypt and parse session info sent from a user
	getSession(sessionString) {
		


		return session;
	}

	encryptSession(session) {

		return session;
	}

	decryptSession(session) {
		return session;
	}

	startSession(request,response) {

	}

	//Called from UserLogout.js
	endSession(request,response) {

	}

	//Check the integrity of the session to see if it matches what we have stored
	checkSession(request,response) {

	}
}

module.exports = SessionHandler;