/*A route for removing a hat to the cart*/
function API(req,res,cookies,session,query,SessionHandler,db,Hats) {
	if (!session) {
		//If there isn't a session the user probably isn't logged in, send them to login
		redirect(req,res,'/login');
	}
	else if (query.id && Hats[query.id]) {
		console.log(session.cart);
		try {
			session.cart.removeItem(Hats[query.id]);
			redirect(req,res,'/cart');
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

function redirect(req,res,url) {
	res.writeHead(301, { Location: url });
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