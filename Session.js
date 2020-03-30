/**
The session Object that is kept track of by SessionHandler
*/

class Session {
	constructor(id,username,admin) {
		if (!username || !id) {
			throw "Error, attempting to start a session without critical data";
		}
		else {
			if (!admin) {
				admin = 0;
			}
			this.id = id;
			this.username = username;
			this.admin = admin;
		}

		//Set a timestamp for the last time the session was accessed
		this.last = Date.now();
	}
}

module.exports = Session;