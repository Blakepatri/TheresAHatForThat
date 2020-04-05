/*A class for handling items stored in a cart
Note that the server handles storing prices in terms of cents. Allows the prices to be stored as integers. 
No need to mess with posibilities of rounding errors.
Carts are kept track of by sessions. 
*/
class Cart {
	constructor() {
		//An object containing hats and their quantity
		//Keys are the hat item ID
		/*
			{
				hat: Hat Object
				qty: INT
			}
		*/
		this.hats = {};
	}

	//Add an item to the cart
	addItem(hat) {
		if (!hat) {
			return false;
		}
		else if (this.hats[hat.id]) {
			this.hats[hat.id].qty += 1;
		}
		else {
			this.hats[hat.id] = {};
			this.hats[hat.id].hat = hat;
			this.hats[hat.id].qty = 1;
		}

	}

	//Remove an item from the Cart
	removeItem(hat) {
		if (!hat || !this.hats[hat.id]) {
			return false;
		}
		else {
			this.hats[hat.id].qty -= 1;

			//It has been removed completely from the cart
			if (this.hats[hat.id].qty <= 0) {
				try {
					delete this.hats[hat.id];
				}
				catch(err) {

				}
			}
		}
	}
}

module.exports = Cart;