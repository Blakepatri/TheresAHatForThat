/*A class to store information about a hat*/
class Hat {
	constructor(id,name,desc,img,price,frontPage,active) {
		this.id = id;
		this.name = name;
		this.desc = desc;
		this.img = img;
		this.price = price;
		this.frontPage = frontPage;
		this.active = active;
	}
}

module.exports = Hat;