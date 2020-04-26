/**
Registration page

constructor: 
*/
function render() {
	return (
		`<div class="login">
			<form action="/register_user" method="POST">
        		<div class="container">
            	<label for="uname"><b>Email</b></label>
                <input type="text" placeholder="Enter Email" name="email" id="email" required>

                <label for="psw"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="psw" id="psw" required>

                <label for="psw"><b>Confirm Password</b></label>
                <input type="password" placeholder="Enter Password again" name="psw-confirm" id="psw-confirm" required>

            		<button type="submit">Register</button>
        		</div>
			</form>
		</div>`
	);
}

module.exports.render = render;