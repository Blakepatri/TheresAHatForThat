function render() {
	return (
		`<div class="add-hats">
            <form>
                <label for="name"><b>Hat Name</b></label>
                <input type="text" name="name">

                <label for="prom"><b>Promotion</b></label>
                <input type="text" name="prom">

                <label for="price"><b>New Price</b></label>
                <input type="text" name="price">

                <label for="img"><b>Add image</b></label>
                <input type="file" id="img" name="img" accept="images/*">

                <button type="submit">Submit</button>
            </form>
        </div>`
	);
}


module.exports.render = render;