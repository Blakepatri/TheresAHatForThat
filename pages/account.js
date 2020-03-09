/**
Home page HTML elements

constructor: 
*/
function render() {
	return (
		`<div class="account">
            <form>
                <label for="name"><b>Name</b></label>
                <input type="text" placeholder="Enter name" name="name">

                <label for="email"><b>Email</b></label>
                <input type="email" placeholder="Enter Email" name="email">

                <label for="psw"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="pasw">

                <label for="psw"><b>Confrim Password</b></label>
                <input type="password" placeholder="Confrim Password" name="psw">

                <button type="submit">Submit</button>
            </form>
        </div>`
	);
}


module.exports.render = render;