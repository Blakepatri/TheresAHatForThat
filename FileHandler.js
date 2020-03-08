/**
A class for getting information about files, as well as readstreams to pipe those files to an HTTP response
*/
const fs = require('fs');
const path = require('path');

//The content types of files the server can send
const contentTypes = {
	".png":"image/png",
	".jpg":"image/jpeg",
	".jpeg":"image/jpeg",
	".gif":"image/gif",
	".bmp":"image/bmp",
	".css":"text/css",
	".csv":"text/csv",
	".html":"text/html",
	".js":"application/javascript",
	".rtf":"text/rtf",
	".json":"application/json",
	".xml":"text/xml",
	".txt":"text/plain"
}

class FileHandler {
	constructor() {

	}

	getBasicFileInfo(fileName,folder) {

	}

	//Return an file in the form of a object:
	/*{
		"readStream":STREAM OBJECT,
		"contentType":"image/jpeg",
		"size":INT
	}
	Returns null if there is an error getting the image*/
	getFile(fileName,folder) {
		var file = null;
		try {
			file = {};
			var filePath = path.join(__dirname,folder,fileName); //Join the folder and name
			file.size = fs.statSync(filePath).size;
			file.readStream = fs.createReadStream(filePath);

			var fileType = filePath.substring(filePath.lastIndexOf("."));
			//Guess the content type
			if (contentTypes[fileType]) {
				file.contentType = contentTypes[fileType];
			}
			else {
				//Try and guess that it is text
				file.contentType = "text/plain";
			}
		}
		catch(err) {
			console.log("Error getting file: ", err);
			file = null;
		}

		return file;
	}

	getImageDimensions(fileName) {
		var dim = {
			"width":0,
			"height":0
		};

		if (fs.existsSync(this.fileLocation + fileName)) {

		}

		return dim;
	}


}

module.exports = FileHandler;