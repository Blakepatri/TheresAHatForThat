function render(session,hats,query) {
    if (!session || (session && session.admin == 0)) {
        return "";
    }
    else {
        try {
            var hat = hats[query.id];

            return (
            `<div class="add-hats">
                <form action="/update_hat" method="POST" enctype="multipart/form-data">
                    <!--I would never do this on a user visible page but this one is only ever seen by admins-->
                    <input style="display: none !important;" type="text" name="productID" value="${hat.id}" required>

                    <label for="name"><b>Hat Name</b></label>
                    <input type="text" name="productName" value="${hat.name}" required>

                    <label for="desc"><b>Description</b></label>
                    <input type="text" name="productDescription" value="${hat.desc}" required>

                    <label for="price"><b>Price in CENTS</b></label>
                    <input type="text" name="productPrice" value="${hat.price}" required>

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

                    <label for="img"><b>Image File</b></label>
                    <input type="text" id="img" name="productImg" value="${hat.img}"required>

                    <button type="submit">Submit</button>
                </form>
            </div>`);
        }
        catch(err) {
            console.log(err)
            return "There was an error displaying the form";
        }
    }
}


module.exports.render = render;