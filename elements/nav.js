/*
Renderer for the navigation bar
**/
function render() {
return (`
		<div class="nav-bar">
			<a class="active" href="/home">Home</a>
  			<div class="nav-bar-right">
    			<a href="/hats">Hats</a>
    			<a href="/account">Account</a>
    			<a href="/orders">Orders</a>
          		<a href="/cart">Cart</a>
    			<a href="/logout">Log Out</a>
  			</div>
		</div>
`);
}

module.exports.render = render;