// Use Parse.Cloud.define to define as many cloud functions as you want.

// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world! From Heroku.");
});

function SendPush (recipientId,message,title,openType,openTypeObjectId,callback){
  // Validate the message text.
  // For example make sure it is under 140 characters
  if (message.length > 140) {
        // Truncate and add a ...
        message = message.substring(0, 137) + "...";
  } 
  // Set the recipient user 
  var recipientUser = new Parse.User();
  recipientUser.id = recipientId;
  // Find devices associated with the recipient user
  var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("userPointer",recipientUser); 

  // Send the push
  Parse.Push.send({
    where: pushQuery, // Our Installation query
    data: {
      alert: message,
      title: title,
      openType: openType,
      openTypeObjectId: openTypeObjectId,
      sound: "default"
    }
  }).then(function() {
    // response.success("Push was sent successfully.");
    callback.success("Push was sent successfully.");
    console.log("Push was sent successfully.");
  }, function(error) {
    // response.error("Push failed to send with error: " + error.message);
    callback.error("Push failed to send with error: " + error.message);
    console.log("Push failed to send with error: " + error.message);
  });
}

Parse.Cloud.define("sendPushToUser", function(request, response) {
  var openType = request.params.openType;
  var openTypeObjectId = request.params.openTypeObjectId;
  var recipientUserId = request.params.recipientId;
  var message = request.params.message;
  var title = request.params.title;
  SendPush(recipientUserId,message,title,openType,openTypeObjectId,{
    success: function(returnValue){
      response.success(returnValue);
    },
    error: function(error){
      response.error(error);
    }
  });
});
