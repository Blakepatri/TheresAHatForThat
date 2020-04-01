function render(session,hats) {
	return (
		`<div class="cart">
      <h1 class="your-items">Your Items</h1>
      ${renderCartItems(session.cart)}
    </div>`
	);
}

function renderCartItems(cart) {
  console.log("RENDERING CART");
  console.log(cart);

  var cartHTML = '';

  for(hat in cart.hats) {
    cartHTML += `
    <div class="row">
        <div class="column">
          <h1 class="h1-cart">${hat.title}</h1>
          <h1>Date of Arrival</h1>
          <h1>Quantity: ${hat.qty}</h1>
          <h1>Price: ${hat.price}</h1>
        </div>
    </div>
    `;
  }
}


module.exports.render = render;