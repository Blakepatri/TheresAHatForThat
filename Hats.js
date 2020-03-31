/*A class for managing all of the hats*/
const Hat = require(__dirname + "/Hat.js");

class Hats {
	constructor(db) {
		//An object containing all of the hats. Keys are the hat ID
		this.hats = {};
		//Needs the database object so it can recall and add new hats
		this.db = db;
	}

	//Load hats into memory for faster responses
	loadHats() {
		console.log("initializing hats from database.");

		this.db.getHats()
		.then((results) => {
			console.log("hats loaded from DB, initializing Hats object.");

			for (var i=0;i<results.length;i++) {
				var id = results[i].productID;
				var isFrontPage = false;
				var isActive = false;
				if (results[i].isFrontPage === 1) {
					isFrontPage = true;
				}
				if (results[i].isActive === 1) {
					isActive = true;
				}

				this.hats[id] = new Hat(id,results[i].productName,results[i].productDescription,results[i].productImage,results[i].productPrice,isFrontPage,isActive);
			}
			console.log("Hats object initialized.");
			console.log(this.hats);
		})
		.catch(function(err) {
			console.log("Error loading the hats! We can't not have hats!");
			throw err;
		}); 
	}

	//Get hat information based on ID
	getHat(id) {
		return this.hats[id];
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