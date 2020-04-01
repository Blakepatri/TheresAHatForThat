function render(session,hats) {
  if (session) {
    return (
      `<div class="cart">
        <h1 class="your-items">Your Items</h1>
        ${renderCartItems(session.cart)}
      </div>`
    );
  }
}

function renderCartItems(cart) {
  console.log("RENDERING CART");
  console.log(cart);
  var items = cart.hats
  console.log(items);
  var cartHTML = '';

  for(item in items) {
    console.log(items[item]);
    cartHTML += `
    <div class="row">
        <div class="column">
          <h1 class="h1-cart">${items[item].hat.name}</h1>
          <h1>Date of Arrival</h1>
          <h1>Quantity: ${items[item].qty}</h1>
          <h1>Price per item: ${(items[item].hat.price / 100).toFixed(2)}</h1>
        </div>
    </div>
    `;
  }

  return cartHTML;
}


module.exports.render = render;