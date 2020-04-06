/**
Admin page
*/
function render(session,hats) {
	//Nobody should make it this far without a session but check anyways
	if (!session || (session && session.admin == 0)) {
		return "";
	}
	else {
		return (`<table class="admin">
			<tr>
				<th>Name</th>
				<th>Price</th>
				<th>frontPage</th>
				<th>isActive</th>
				<th></th>
			</tr>
			${renderAdminList(hats)}</table>
		<a class="add-hat-button" href="/addhat">Add Hat</a>`);
	}
}

//Render the listing of all the hats
function renderAdminList(hats) {
	var HTMLString = "";

	for(item in hats) {
		var hat = hats[item];
		HTMLString += `<tr>
			<td>${hat.name}</td>
			<td>${hat.price}</td>
			<td>${hat.frontPage}</td>
			<td>${hat.active}</td>
			<td><a href="/edithat?id=${hat.id}">EDIT</a></td>
		</tr>`;
	}

	return HTMLString;
}

module.exports.render = render;