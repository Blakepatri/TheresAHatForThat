/**
Home page HTML elements

constructor: 
*/
function render() {
	return (
		`<div class="login">
			<form action="/register_user" method="POST">
        		<div class="container">
            		<label for="uname"><b>Email</b></label>
            		<input type="text" placeholder="Enter Email" name="uname" required>

            		<label for="psw"><b>Password</b></label>
            		<input type="password" placeholder="Enter Password" name="psw" required>

                    <label for="psw"><b>Confirm Password</b></label>
                    <input type="password" placeholder="Enter Password again" name="psw-confirm" required>

            		<button type="submit">Register</button>
        		</div>

          		<div class="container" style="background-color:#f1f1f1">
            		<button type="button" class="cancelbtn">Cancel</button>
            		<span class="psw">Forgot <a href="#">password?</a></span>
          		</div>
			</form>
		</div>`
	);
}


module.exports.render = render;