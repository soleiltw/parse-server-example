
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi from heroku.');
});

Parse.Cloud.define("sendPushToUser", function(request, response) {
  var recipientEmail = request.params.email;
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
    userQuery.equalTo("email", recipientEmail);

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
    }).then(function() {
      // Check if push query
        response.success("Push success.");
    }, function(error) {
        response.error("Push failed to send with error: " + error.message);
    });
});
