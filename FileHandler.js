/**
A class for getting information about files, as well as readstreams to pipe those files to an HTTP response
*/
const fs = require('fs');
const path = require('path');

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
			console.log("Filepath: " + filePath)
			file.size = fs.statSync(filePath).size;
			file.readStream = fs.createReadStream(filePath);

			var fileType = filePath.substring(filePath.lastIndexOf("."));
			//Guess the content type
			if (fileType == ".jpg" || fileType == ".jpeg") {
				file.contentType = "image/jpeg";
			}
			else if (fileType == ".png") {
				file.contentType = "image/png";
			}
			else if (fileType == ".gif") {
				file.contentType = "image/gif";
			}
			else if (fileType == ".bmp") {
				file.contentType = "image/bmp";
			}
			else {
				//Try and guess that it is the common JPG type
				file.contentType = "image/jpeg";
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