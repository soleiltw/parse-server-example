
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi from heroku.');
});

Parse.Cloud.define("sendPushToUser", function(request, response) {
  var senderUser = request.user;
  var recipientUserId = request.params.recipientId;
  var message = request.params.message;
  var title = request.params.title;
  var activity = request.params.activity;
 
  // Validate the message text.
  // For example make sure it is under 140 characters
  if (message.length > 140) {
  // Truncate and add a ...
    message = message.substring(0, 137) + "...";
  }
 
  // Send the push.
  // Find devices associated with the recipient user
  var recipientUser = new Parse.User();
  recipientUser.id = recipientUserId;
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("userPointer", recipientUser);
  
  // Send the push notification to results of the query
  Parse.Push.send({
    where: pushQuery,
    data: {
      alert: message,
      title: title,
      activity: activity
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
