/*
Renderer for the navigation bar
**/
function render() {
return (`
<div class="nav-bar">
	<a class="active" href="#home">Home</a>
  	<div class="nav-bar-right">
    	<a href="#hats">Hats</a>
    	<a href="#account">Account</a>
    	<a href="#order">Orders</a>
    	<a href="#about">Abou</a>
    	<a href="#log-out">Log Out</a>
    	<a href="#search">Search</a>
  	</div>
</div>
`);
}

module.exports.render = render;