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
            		<input type="text" placeholder="Enter Email" name="email" required>

            		<label for="psw"><b>Password - Must be at least 10 characters.</b></label>
            		<input type="password" placeholder="Enter Password" name="psw" required>

                    <label for="psw"><b>Confirm Password</b></label>
                    <input type="password" placeholder="Enter Password again" name="psw-confirm" required>

            		<button type="submit">Register</button>
        		</div>
			</form>
		</div>`
	);
}

module.exports.render = render;