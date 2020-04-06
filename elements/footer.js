/*
Renderer for the footer
**/
function render(session) {
	if (session && session.admin > 0) {
		return (`
		  <footer>
		    <a href="/admin">admin</a>
		  </footer>
		`);
	}
	else {
		return (`
		  <footer>
		    
		  </footer>
		`);
	}
}

module.exports.render = render;