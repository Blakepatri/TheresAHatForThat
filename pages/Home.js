/**
Home page HTML elements

constructor: 
*/
function render(session,hats) {
	return (`
		<div class="home">
      <div class="row">
          ${renderHats(hats)}
      </div>
    </div>
		`);
}

function renderHats(hats) {
  var hatsHTML = "";

  for(var hat in hats) {
    if (hats[hat].frontPage) {
      hatsHTML += `
      <a class="column" href="/hat?id=${hats[hat].id}">
        <img src="/images/${hats[hat].img}">
        <h1>${hats[hat].name}</h1>
        <h2>$${(hats[hat].price / 100).toFixed(2)}</h2>
      </a>`;
    }
  }

  return hatsHTML;
}


module.exports.render = render;