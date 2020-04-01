/**
The session Object that is kept track of by SessionHandler
*/
const path = require('path');
const Cart = require(path.join(__dirname,"Cart.js"));

class Session {
	constructor(userId,username,admin) {
		if (!username || !userId) {
			throw "Error, attempting to start a session without critical data";
		}
		else {
			if (!admin) {
				admin = 0;
			}
			this.userId = userId;
			this.username = username;
			this.admin = admin;
			this.cart = new Cart();
		}

		//Set a timestamp for the last time the session was accessed
		this.last = Date.now();
	}
}

module.exports = Session;