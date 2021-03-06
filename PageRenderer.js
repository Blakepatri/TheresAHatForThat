const path = require('path');
/**
A class for rendering pages, calls an individual page's render() function in order to generate the content of the body
*/
class PageRenderer {
	constructor(nav,footer,pages) {
		if (!nav) {
			this.nav = require(path.join(__dirname,"elements","nav.js"));
		}
		else {
			this.nav = require(path.join(__dirname,"elements",nav));
		}

		if (!footer) {
			this.footer = require(path.join(__dirname,"elements","footer.js"));
		}
		else {
			this.footer = require(path.join(__dirname,"elements",footer));
		}
	}

	//The function that actually creates the HTML for user requests.
	//Page object is what gets loaded from routing.json. 
	//The render function is specified in that config and loaded from the appropriate file
	//Not all pages need to take into account, sessions, hats, or queries.
	render(page,session,hats,query) {
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
				${page.render(session,hats,query)}
				${footer.render(session)}
			</body>
			</html>
		`);
	}
}

module.exports = PageRenderer;