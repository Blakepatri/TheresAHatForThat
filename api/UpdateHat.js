const qs = require('querystring');
const formidable = require('formidable');
const crypto = require('crypto');
const path = require('path');
const Hat = require(path.join(__dirname,"..","Hat.js"));
/**
A function to handle updating a hat
*/
function API(req,res,cookies,session,query,SessionHandler,db,hats) {
	console.log("UPDATE HAT")
	if (req.method === 'POST' && session && session.userId && session.admin > 0) {
	 	var form = formidable({ multiples: true, uploadDir: path.join(__dirname,"..","images") });
	    form.parse(req, function (err, fields, files) {
	    	console.log("FORM PARSED: ",fields);
	    	console.log(files);
	    	try {
	    		var isActiveNum,isActive;
        		var isFrontPage,isFrontPageNum;
	    		if (fields.isActive === "true") {
	    			//Sent as string
	    			isActiveNum = 1;//Stored as tinyint
	    			isActive = true;
	    		}
	    		else {
	    			isActiveNum = 0;
	    			isActive = false;
	    		}

	    		if (fields.isFrontPage === "true") {
	    			//Sent as string
	    			isFrontPageNum = 1;//Stored as tinyint
	    			isFrontPage = true;
	    		}
	    		else {
	    			isFrontPageNum = 0;
	    			isFrontPage = false;
	    		}

	    		//Update the hat's entry in the DB
        		db.updateHat(fields.productID,fields.productName,fields.productDescription,fields.productPrice,fields.productImg,isActiveNum,isFrontPageNum)
        		.then(function(results) {
        			console.log("Hat updated with ID: " + fields.productID);
        			try {
        				//delete the old hat object
        				delete hats[fields.productID];
        			}
        			catch(err) {

        			}
        			//update the hats loaded in memory
        			hats[fields.productID] = new Hat(fields.productID,fields.productName,fields.productDescription,fields.productImg,fields.productPrice,isFrontPage,isActive)
        			console.log("Updated Hat:");
        			console.log(hats[fields.productID]);
        			redirect(req,res,"/admin");
        		})
        		.catch(function(err) {
        			console.log(err);
        			sendError(res,500,"SQL error updating the hat in the database.");
        		});
	    	}
	    	catch(err) {
	    		console.log(err);
	    		sendError(res,500,"Sorry, something went wrong when processing your request.");
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