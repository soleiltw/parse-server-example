
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi from heroku.');
});

Parse.Cloud.define("sendPushToUser", function(request, response) {
    var recipientGUID = request.params.guid;
    var message = request.params.message;
    var title = request.params.title;
    var sound = request.params.sound;
 
 
    // Validate the message text.
    // For example make sure it is under 140 characters
    if (message.length > 140) {
        // Truncate and add a ...
        message = message.substring(0, 137) + "...";
    }
 
    // Send the push.
    // Find devices associated with the recipient user

    var userQuery = new Parse.Query(Parse.User);
    userQuery.equalTo("guid", recipientGUID);

    var pushQuery = new Parse.Query(Parse.Installation);
    pushQuery.matchesQuery("userPointer", userQuery);
    // Send the push notification to results of the query
    Parse.Push.send({
     where: pushQuery,
     data: {
      alert: message,
      title: title,
      sound: sound
        }
    }, {
    useMasterKey: true,
        success: function () {
            response.success("Push was sent successfully.")
        },
        error: function (error) {
            response.error("Push failed to send with error: " + error.message);
        }
    });
});

Parse.Cloud.define("setDeviceToken", function(request, response) {
    var installationId = request.params.installationId;
    var deviceToken = request.params.deviceToken;

    var query = new Parse.Query(Parse.Installation);
    query.get(installationId, {useMasterKey: true}).then(function(installation) {
        console.log(installation);
        installation.set("deviceToken", deviceToken);
        installation.save(null, {useMasterKey: true}).then(function() {
            response.success(true);
        }, function(error) {
            response.error(error);
        })
    }, function (error) {
        console.log(error);
    })
});
