//A page for displaying a user's orders. Would have been better to implement this with AJAX than an iframe
function render() {
	return (
		`<div class="orders">
      <h1 class="your-items">Your Orders</h1>
    </div>
    <iframe class="orders-frame" src="/get_orders">`
	);
}


module.exports.render = render;