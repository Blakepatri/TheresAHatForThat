/**
Home page HTML elements

constructor: 
*/
function render() {
	return (
		`<div class="admin">
        	<button type="button">ADD/REMOVE/MODIFY HAT</button>
        	<button type="button">ADD/REMOVE/MODIFY Promotion</button>
        	<button type="button">Force Account Password Reset</button>
    	</div>`
	);
}


module.exports.render = render;