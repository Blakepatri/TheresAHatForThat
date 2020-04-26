/**
The session Object that is kept track of by SessionHandler
SessionHandler.sessions object contains all currently active sessions
Also keeps track of the cart object
*/
const path = require('path');
const Cart = require(path.join(__dirname,"Cart.js"));

class Session {
	constructor(userId,username,admin,ipAddr,useragent) {
		if (!username || !userId || !useragent) {
			throw "Error, attempting to start a session without critical data.";
		}
		else {
			if (!admin) {
				admin = 0;
			}
			this.userId = userId;
			this.username = username;
			this.admin = admin;
			this.ipAddr = ipAddr;
			this.useragent = useragent;
			this.cart = new Cart();
			//Set a timestamp for the last time the session was accessed
			this.last = Date.now();

			//Set the session ID by simply concatinating the timestamp and userId, will generate a unique value. 
			//If someone is trying to start many sessions with the same user it might overwrite a session, but that isn't anything to be concerned about
			this.id = this.userId + "-" + this.last;
		}
	}
}

module.exports = Session;