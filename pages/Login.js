/**
Home page HTML elements

constructor: 
*/
function render(session,hats,query) {
	return (
		`<div class="login">
			<form action="/user_login" method="POST">
        		<div class="container">
            		<label for="uname"><b>Email</b> ${renderLoginError(query)}</label>
                    <input type="text" placeholder="Enter Username" name="uname" id="uname" required>

                    <label for="psw"><b>Password</b></label>
                    <input type="password" placeholder="Enter Password" name="psw" id="psw" required>

            		<button type="submit">Login</button>

        		</div>

          		<div class="container" style="background-color:#f1f1f1">
            		<button type="button" class="cancelbtn">Cancel</button>
            		<span class="psw"><a href="/register">Do you need to register?</a></span>
          		</div>
			</form>
		</div>`
	);
}

function renderLoginError(query) {
    if (query && query["login_error"]) {
        return " - Sorry, but your email or password is incorrect.";
    }
    else {
        return "";
    }
}


module.exports.render = render;