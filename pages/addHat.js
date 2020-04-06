function render() {
	return (
		`<div class="add-hats">
            <form action="/add_hat" method="POST" enctype="multipart/form-data">
                <label for="name"><b>Hat Name</b></label>
                <input type="text" name="productName" required>

                <label for="desc"><b>Description</b></label>
                <input type="text" name="productDescription" required>

                <label for="price"><b>Price in CENTS</b></label>
                <input type="text" name="productPrice" required>

                <label for="price"><b>Will it be on the front page?</b></label>
                <select name="isFrontPage">
                    <option value="true">Yes</option>
                    <option value="false" selected>No</option>
                </select>

                <label for="price"><b>Will it be available immediately?</b></label>
                <select name="isActive">
                    <option value="true" selected>Yes</option>
                    <option value="false">No</option>
                </select>

                <label for="img"><b>Add image</b></label>
                <input type="file" id="img" name="img" accept="images/*" required>

                <button type="submit">Submit</button>
            </form>
        </div>`
	);
}


module.exports.render = render;