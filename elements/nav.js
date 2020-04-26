/*
Renderer for the navigation bar
**/
function render(session) {
  if (session) {
    return (`
<div class="nav-bar">
  <a class="active" href="/home">Home</a>
    <div class="nav-bar-right">
      <a href="/hats">Hats</a>
      <a href="/account">Account</a>
      <a href="/orders">Orders</a>
          <a href="/cart">Cart</a>
      <a href="/user_logout">Log Out</a>
    </div>
</div>
<h1 class="title">There's A Hat For That</h1>
`);
  }
  else {
    return (`
<div class="nav-bar">
  <a class="active" href="/home">Home</a>
    <div class="nav-bar-right">
      <a href="/hats">Hats</a>
      <a href="/login">Log In</a>
    </div>
</div>
<h1 class="title">There's A Hat For That</h1>
`);
  }

}

module.exports.render = render;