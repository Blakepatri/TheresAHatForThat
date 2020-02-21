/**
A class for rendering pages
*/

class PageRenderer {
	constructor(nav,footer,pages) {
		if (!nav) {
			this.nav = require(__dirname + "/elements/nav.js");
		}
		else {
			this.nav = require(__dirname + "/elements/" + nav);
		}

		if (!footer) {
			this.footer = require(__dirname + "/elements/footer.js");
		}
		else {
			this.footer = require(__dirname + "/elements/" + footer);
		}
	}

	render(page) {
		var nav = this.nav;
		var footer = this.footer;

		return (`
		  	<!DOCTYPE html>
			<html>
				<title>${page.title}</title>
			<head>
			</head>
			<body>
				${nav.render()}
				${page.render()}
				${footer.render()}
			</body>
			</html>
		`);
	}
}

module.exports = PageRenderer;