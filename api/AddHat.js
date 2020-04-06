const formidable = require('formidable');
const fs = require('fs');
const path= require('path');
const Hat = require(path.join(__dirname,"..","Hat.js"));
/**
A function to handle adding a hat to the database
*/
function API(req,res,cookies,session,query,SessionHandler,db,hats) {
	console.log("ADD HAT")
	if (req.method === 'POST' && session && session.userId && session.admin > 0) {
	 	var form = formidable({ multiples: true, uploadDir: path.join(__dirname,"..","images") });
	    form.parse(req, function (err, fields, files) {
	    	console.log("FORM PARSED: ",fields);
	    	console.log(files);
	    	try {
	    		if (files.img.path) {
	    			//File is temporarily stored by formidable as a generic name
	    			console.log(files.img.path);
		    		//Get rid of possible path characters, though admins should know better
		    		var imageName = files.img.name.replace("..","").replace("\\","").replace("/","").replace("~","");
		    		var filePath = path.join(__dirname,"..","images",imageName);
		    		//Move the file by changing the path
		    		fs.rename(files.img.path, filePath, function (err) {
			        	if (err) {
			        		console.log(err);
			        		sendError(res,500,"Sorry, something went wrong moving the image path.");
			        	}
			        	else {
			        		console.log("Image uploaded for new hat, adding hat to database");
			        		var isActive = fields.isActive === "true";//Sent as string
			        		var isFrontPage = fields.isFrontPage === "true";
			        		db.addHat(fields.productName,fields.productDescription,fields.productPrice,imageName,isActive,isFrontPage)
			        		.then(function(results) {
			        			console.log("New Hat Added with ID: " + results.insertId);
			        			//update the hats loaded in memory
			        			hats[results.insertId] = new Hat(results.insertId,fields.productName,fields.productDescription,imageName,fields.productPrice,isFrontPage,isActive)
			        			console.log("New Hat:");
			        			console.log(hats[results.insertId]);
			        			redirect(req,res,"/admin");
			        		})
			        		.catch(function(err) {
			        			console.log(err);
			        			sendError(res,500,"SQL error adding the hat to the database.");
			        		})
			        	}
			      	});
	    		}
	    		else {
	    			sendError(res,500,"Error: image file path not found");
	    		}
	    	}
	    	catch(err) {
	    		console.log(err);
	    		sendError(res,500,"Sorry, something went wrong when processing your request.");
	    	}
	    });














		/*var body = [];
		req.on('data', (chunk) => {
		  	body.push(chunk);
		  	//There's no way an email and password should be taking that many bits, kill the connection.
		  	if (body.length > 5000) {
                req.connection.destroy();
		  	}
		}).on('end', () => {
		  	body = Buffer.concat(body).toString();
		  	var postData = qs.parse(body);
		  	console.log("ADD HAT POST DATA: ",postData);

		});*/
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