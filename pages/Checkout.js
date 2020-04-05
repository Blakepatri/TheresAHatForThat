function render(session) {
	var totalPrice;
	try {
		totalPrice = getTotalPrice(session.cart);
	}
	catch(err) {
		console.log(err);
	}

	return (`<div class="checkout">
	<div class="total-price">Your total is: ${(totalPrice / 100).toFixed(2)}</div>

	<form action="/user_checkout" method="POST">
		<input type="text" placeholder="First Name" name="fname" required>
		<input type="text" placeholder="Last Name" name="lname" required>
		<input type="number" placeholder="Credit Cart Number" name="credit" required>
		<input class="checkout-csv" type="number" placeholder="CSV" name="csv" maxlength="3" min="100" max="999" required>
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