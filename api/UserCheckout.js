/*A route for checking a user out. Ordinarily this would be handled entirely by payment processing services
like Strype.*/
function API(req,res,cookies,session,query,SessionHandler,db,Hats) {
	if (!session) {
		//If there isn't a session the user probably isn't logged in, send them to login
		redirect(req,res,'/login');
	}
	else if (session.userId && session.cart && req.method == "POST") {
		//Check to see if at the very least the session has an ID and cart object.

		//Get the post data
		var body = [];
		req.on('data', (chunk) => {
		  	body.push(chunk);
		  	//There's no way the cart should be over 5000 bytes, kill connection
		  	if (body.length > 5000) {
                req.connection.destroy();
		  	}
		}).on('end', () => {
		  	body = Buffer.concat(body).toString();
		  	var postData = qs.parse(body);

		  	var credit;

		  	try {
		  		credit = postData['credit'].replace(" ","");
		  	}
		  	catch(err) {

		  	}

		  	//super basic credit card validation
		  	if (isEmailValid(postData['fname']) && postData['fname'] && credit && postData['csv'] && credit.length == 16 && postData['csv'].length == 3)  {
		  		
		  	}
		  	else {
		  		//invalid CC info
		  		sendError(res,200,"Invalid credit card info.");
		  	}
		});
	}
	else {
		sendError(res,500,"Sorry, something went wrong when processing your request.");
	}
}

function redirect(req,res,url) {
	res.writeHead(307, { Location: url });
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