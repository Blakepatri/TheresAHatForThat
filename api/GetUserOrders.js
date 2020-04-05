/**
A function to get and format a user's orders for display
This should have been done through AJAX, wouldnt have needed iframe shenanigans
*/
function API(req,res,cookies,session,query,SessionHandler,db) {
	if (!session || !session.userId) {
		redirect(req,res,"/login");
	}
	else {
		db.getUserOrders(session.userId)
		.then(function(results){
			var orderHTML = renderOrderHTML(results);
			HTMLResponse(req,res,orderHTML);
		})
		.catch(function(err) {
			console.log(err);
			sendError(res,code,"There was an issue getting your orders, if this persists please contact our staff for further assitance.") 
		});
	}
}

//Create the HTML of the order information
function renderOrderHTML(orders) {
	var ordersHTML = '';

	var currentOrder = -1;

	for(var i=0;i<orders.length;i++) {
		if (currentOrder != orders[i].trackingNumber) {
			//New order about to start, 
			currentOrder = orders[i].trackingNumber;
			ordersHTML +=
				`<div class="order-header-top">Tracking Number: ${orders[i].trackingNumber}</div>
				<div class="order-header">Price: ${(orders[i].total / 100).toFixed(2)}</div>
				<div class="order-header">Date: ${orders[i].timeCreated}</div>`;
		} 
		//Add the item info
		ordersHTML +=			
			`<div class="order-item">Item: ${orders[i].productName}</div>
			<div class="order-qty">Amount: ${orders[i].qty}</div>`;
	}

	return ordersHTML;
}

//A standard web page response
function HTMLResponse(req,res,HTMLData) {
	var HTMLDoc = `<!DOCTYPE html>
	<html>
	<head>
		<title>Your Orders</title>
		<link rel="stylesheet" type="text/css" href="/css/css.css">
	</head>
	<body>
		${HTMLData}
	</body>
	</html>`


	try {
		res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
	    res.writeHead(200, {
	        'Content-Type': "text/html"
	    });
	    res.write(HTMLDoc);
	    res.end();
	}
	catch(err) {
		console.log(err);
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