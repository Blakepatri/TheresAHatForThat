/**
Home page HTML elements

constructor: 
*/
function render() {
	return (
		`<div class="login">
			<form action="/user_login" method="POST">
        		<div class="container">
            		<label for="uname"><b>Username</b></label>
            		<input type="text" placeholder="Enter Username" name="uname" required>

            		<label for="psw"><b>Password</b></label>
            		<input type="password" placeholder="Enter Password" name="psw" required>

            		<button type="submit">Login</button>

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