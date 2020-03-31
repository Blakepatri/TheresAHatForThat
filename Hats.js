/*A class for managing all of the hats*/
const Hat = require(__dirname + "/Hat.js");

class Hats {
	constructor() {
		//An object containing all of the hats. Keys are the hat ID
		this.hats = {};
	}

	//Load hats into memory for faster responses
	loadHats(db) {
		console.log("initializing hats from database.");

		db.getHats()
		.then((results) => {
			console.log("hats loaded: ");
			console.log(results);
		})
		.catch(function(err) {
			console.log("Error loading the hats! We can't not have hats!");
			throw err;
		}); 
	}

	//Get hat information based on ID
	getHat(id) {

	}

	//Add a new hat to the database
	addHat() {

	}

	//Hats shouldn't be permanently removed as their ID codes are tied to things, instead flag it as no longer available
	deactivateHat(id) {

	}

	//Reactivate a hat so it can be sold again
	activateHat(id) {

	}
}

module.exports = Hats;