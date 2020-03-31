/*
A page for displaying all of the hats. 
This could be improved by caching the latest HTML and just serving that instead of generating it each time.
*/
function render(session,hats) {
	return (
		`<div class="hats">
      <div class="row_hats">
          ${renderhats(hats)}                                                                
      </div>
    </div>`
	);
}

function renderhats(hats) {
  var hatsHTML = "";

  for(var hat in hats) {
    if (hats[hat].active) {
      hatsHTML += `
      <a class="column_hats" href="/hat?id=${hats[hat].id}">
        <img src="/images/${hats[hat].img}" class="img_hats">
        <h1 class="h1_hats">${hats[hat].name}</h1>
        <h1 class="h1_hats">$${(hats[hat].price / 100).toFixed(2)}</h1>         
      </a>
      `;
    }
  }

  return hatsHTML;
}


module.exports.render = render;