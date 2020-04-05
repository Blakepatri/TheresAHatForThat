const qs = require('querystring');
/*A route for checking a user out. Ordinarily this would be handled by payment processing services
like Strype, then passed back to our systems for creating the order entries in the database.*/
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
		  	if (postData['fname'] && postData['lname'] && credit && postData['csv'] && credit.length == 16 && postData['csv'].length == 3)  {
		  		//Assume CC info good, create the order
		  		//Format the date string so mySQL won't throw a hissy fit about it being a weird value
		  		var orderTime = new Date().toISOString().slice(0, 19).replace("T", " ");
		  		var isShipped = 1; //Insufficient group support to implement this properly
		  		var trackingNumber = "" + Math.round(Math.random() * 100000000);//This could be implemented better
		  		var userId = session.userId;
		  		var orderTotal = session.cart.getTotal();

		  		if (orderTotal <= 0) {
		  			//Not giving away stuff for free
		  			console.log("Error: a user is trying to check out with a total of zero or less: " + orderTotal);
		  			sendError(res,500,"Sorry, something went wrong when processing your request.");
		  		}
		  		else {
		  			console.log("Creating order: ");
			  		console.log(orderTime,isShipped,trackingNumber,userId,orderTotal);
			  		//Create the order
			  		db.createOrder(orderTime,isShipped,trackingNumber,userId,orderTotal).then(function(results) {
			  			//Order created, add the products to the orderHasItem table
			  			console.log("Order created with id: " + results.insertId);
			  			
			  			if (results.insertId) {
			  				//Add the items to orderHasItem
			  				console.log(session.cart);
			  				var cartItems = session.cart.hats
			  				for (var item in cartItems) {
			  					db.orderHasItem(results.insertId,item,cartItems[item].qty).then(function(results) {
			  						console.log("Item added",results.insertId,item,cartItems[item].qty);
			  						//Clear it from the cart
			  						try {
			  							session.cart.removeAllOfItem(item);
			  						}
			  						catch(err) {
			  							console.log(err);
			  						}
			  					})
			  					.catch(function(err) {
			  						console.log(err);
			  					});
			  				}

			  				//Everything SHOULD be okay at this point, redirect to complete page
			  				redirect(req,res,"/checkout_complete");
			  			}
			  			else {
			  				sendError(res,500,"Sorry, something went wrong when processing your request. The order may have been created but items were not added to it. Please contact our staff for further assistance");
			  			}
			  		})
			  		.catch(function(err) {
			  			console.log(err);
			  			sendError(res,500,"Sorry, something went wrong when creating the order.");
			  		});
		  		}
		  	}
		  	else {
		  		//invalid CC info
		  		sendError(res,200,"Invalid credit card or user info.");
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