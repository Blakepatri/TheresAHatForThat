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
  var items = cart.hats
  var cartHTML = '';

  for(item in items) {
    console.log(items[item]);
    cartHTML += `
    <div class="row">
      <h1 class="h1-cart">${items[item].hat.name}</h1>
      <h1 class="h1-cart">Quantity: ${items[item].qty}</h1>
      <h1 class="h1-cart">Price per item: ${(items[item].hat.price / 100).toFixed(2)}</h1>
      <a class="cart-button" href="/remove_from_cart?id=${items[item].hat.id}">Remove from cart</a>
    </div>
    `;
  }

  return cartHTML;
}


module.exports.render = render;