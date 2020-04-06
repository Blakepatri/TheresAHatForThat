/**
User account page
Should probably have first name and last name but I did not get a chance to implement those
constructor: 
*/
function render(session) {
	return (
		`<div class="account">
            <form action="/update_account" method="POST">
                <label for="email"><b>Email</b></label>
                <input type="email" placeholder="Enter Email" name="email" value="${session.username}">

                <label for="psw"><b>Password</b></label>
                <input type="password" placeholder="Enter Password" name="pass" value="">

                <label for="psw"><b>Confrim Password</b></label>
                <input type="password" placeholder="Confrim Password" name="passConfirm" value="">

                <input type="submit">Submit</input>
            </form>
        </div>`
	);
}

module.exports.render = render;