/*A route for adding a hat to the cart.
Cart objects are a part of Session objects*/
function API(req,res,cookies,session,query,SessionHandler,db,Hats) {
	console.log("ADD TO CART");
	console.log(query);
	console.log(query.id)
	console.log(Hats[query.id]);

	if (!session) {
		redirectToLogin(req,res);
	}
	else if (query.id && Hats[query.id]) {
		console.log(session.cart);
		try {
			session.cart.addItem(Hats[query.id]);
		}
		catch(err) {
			console.log(err);
			sendError(res,500,"Sorry, something went wrong when processing your request.");
		}
		console.log(session.cart);
	}
	else {
		sendError(res,500,"Sorry, something went wrong when processing your request.");
	}
}

function redirectToLogin(req,res) {
	res.writeHead(301, { Location: '/login' });
	res.end();
}

function sendError(res,code,message) {
	try {
		res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
	    res.writeHead(code, {
	        'Content-Type': "text/html"
	    });
	    res.write(message);
	    res.end();
	}
	catch(err) {
		console.log(err);
	}
}

module.exports.API = API;