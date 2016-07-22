
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi from heroku.');
});

function sayHello() {
	var startDate = new Date();
	startDate.setMinutes(startDate.getMinutes() - 31 );
	var endDate = new Date();
	endDate.setMinutes(endDate.getMinutes() - 1 );

	console.log("startDate  = " + startDate.toString());
	console.log("endDate  = " + endDate.toString());

	
}