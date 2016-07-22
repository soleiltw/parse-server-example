
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi from heroku.');
});

Parse.Cloud.define('queryBeaconSpot', function(req, res){

	var query = new Parse.Query('BeaconSpot');
	query.find({ useMasterKey: true }).then(
		function(result) {
			console.log("Successfully retrieved " + results.length + " beacon spot.");
		
			for (var i = 0; i < results.length; i++) {
				var object = results[i];
				console.log(object.id + ' - ' + object.get('name'));
    		}
			res.success('QueryBeaconSpot success.');
		
		}, function(error) {
			console.log("error: "+error);
			res.error(error);
	});
});

Parse.Cloud.define('getTotalBeaconSpot', function(request, response) {
	var query = new Parse.Query('BeaconSpot');
	query.count({ useMasterKey: true }) // count() will use the master key to bypass ACLs
    .then(function(count) {
      response.success(count);
    }); 
});