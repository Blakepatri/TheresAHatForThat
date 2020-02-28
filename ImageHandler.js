/**
A class for handling the information of images
*/
const fs = require('fs');

class ImageHandler {
	constructor(fileLocation) {
		if (!fileLocation) {
			this.fileLocation = __dirname + "/images";
		}
		else {
			this.fileLocation = fileLocation;
		}

		this.findImages();
	}

	//These images will be the only ones allowed to be served
	findImages() {
		fs.readdir(this.fileLocation, (err,files) => {
			this.setImageList(err,files);
		});
	}

	setImageList(err,files) {
		this.images = files;
		console.log("IMAGE FILES: ",files);
	}

	//Return an image in the form of a object:
	/*{
		"readStream":STREAM OBJECT,
		"contentType":"image/jpeg",
		"size":INT
	}
	Returns null if there is an error getting the image*/
	getImage(path) {
		var img = null;
		var imgName = path.substring(path.lastIndexOf("/") + 1);
		console.log("Image path: ",imgName,path);

		if (this.images.includes(imgName)) {
			//Should be okay to serve it if it is in the image directory
			try {
				img = {};
				img.size = fs.statSync(path).size;
				img.dataStream = fs.createReadStream(path);

				var fileType = path.substring(path.lastIndexOf("."));
				//Guess the content type
				if (fileType == ".jpg" || fileType == ".jpeg") {
					img.contentType = "image/jpeg";
				}
				else if (fileType == ".png") {
					img.contentType = "image/png";
				}
				else if (fileType == ".gif") {
					img.contentType = "image/gif";
				}
				else if (fileType == ".bmp") {
					img.contentType = "image/bmp";
				}
				else {
					//Try and guess that it is the common JPG type
					img.contentType = "image/jpeg";
				}
			}
			catch(err) {
				console.log("Error getting image: ", err);
				img = null;
			}
		}

		return img;
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

module.exports = ImageHandler;