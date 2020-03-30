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

	render(page,session) {
		var nav = this.nav;
		var footer = this.footer;

		//Placeholder in case there isn't a title set, better than undefined
		if (!page.title) {
			page.title = " ";
		}

		return (`
		  	<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<link rel="stylesheet" type="text/css" href="/css/css.css">
				<title>TAHFT - ${page.title}</title>
			</head>
			<body>
				${nav.render(session)}
				${page.render(session)}
				${footer.render(session)}
			</body>
			</html>
		`);
	}
}

module.exports = PageRenderer;