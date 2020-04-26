function render(session) {
	var totalPrice;
	try {
		totalPrice = getTotalPrice(session.cart);
	}
	catch(err) {
		console.log(err);
	}

	return (`<div class="checkout">
	<div class="total-price">Your total is: $${(totalPrice / 100).toFixed(2)}</div>

	<form action="/user_checkout" method="POST">
		<label for="fname"><b>First Name</b></label>
		<input type="text" placeholder="First Name" name="fname" required>
		<label for="lname"><b>Last Name</b></label>
		<input type="text" placeholder="Last Name" name="lname" required>
		<label for="credit"><b>Credit Card Number</b></label>
		<input type="number" placeholder="Credit Card Number" name="credit" maxlength="16" value="0123456789101112" required>
		<label for="CSV"><b>CSV</b></label>
		<input class="checkout-csv" type="number" placeholder="CSV" name="csv" maxlength="3" min="100" max="999" value="123" required>
		<input class="cart-button" type="submit" name="submit" value="Checkout">
	</form>
</div>`); 
}

function getTotalPrice(cart) {
  var items = cart.hats
  var totalPrice = 0;

  for(item in items) {
    totalPrice += (items[item].qty * items[item].hat.price);
  }

  return totalPrice;
}

module.exports.render = render;