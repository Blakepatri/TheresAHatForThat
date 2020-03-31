/*HTML rendering for an individual hat page
Does not render pages set to inactive!
*/
function render(session,hats,query) {
	try {
		if (hats[query.id].active) {
			return (
			`<div class="item">
	      		<img src="/images/${hats[query.id].img}">
	      		<h1 class="items-extra">${hats[query.id].name}</h1>
	      		<h1 class="items-extra">$${(hats[query.id].price / 100).toFixed(2)}</h1>
	      		<a href="/add_to_cart?id=${query.id}" class="items-extra">Add to Cart</a>
	      		<p class="items-extra">${hats[query.id].desc}</p>
			</div>`);
		}
		else {
			return (
			`<div class="item">
	      		<p class="items-extra">Sorry, but that hat wasn't found!</p>
			</div>`);
		}
	}
	catch(err) {
		return (
		`<div class="item">
      		<p class="items-extra">Sorry, but that hat wasn't found!</p>
		</div>`);
	}	
}

module.exports.render = render;