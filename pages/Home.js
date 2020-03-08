/**
Home page HTML elements

constructor: 
*/
function render() {
	return (`
		<div class="home">
			<div class="row">
  				<div class="column">
  					<img src="..\images\hat1.jpg">
  					<h1>Hat Of The Day</h1>
  				</div>
  				<div class="column">
  					<img src="..\images\hat2.jpg">
  					<h1>Hat Of The Day</h1>  					
  				</div>
  				<div class="column">
  					<img src="..\images\hat3.jpg">
  					<h1>Hat Of The Day</h1>  					
  				</div>
			</div>
		</div>
		`);
}


module.exports.render = render;