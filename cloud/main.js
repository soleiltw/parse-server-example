// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world! From Heroku.");
});

Parse.Cloud.job("pushToCaretaker", function(request, response) {
  var startDate = new Date();
  startDate.setMinutes(startDate.getMinutes() - 31 );
  var endDate = new Date();
  endDate.setMinutes(endDate.getMinutes() - 1 );

  console.log("startDate  = " + startDate.toString());
  console.log("endDate  = " + endDate.toString());

  // Query for punchCard
  var punchCardQuery = new Parse.Query("PunchCard");
  punchCardQuery.greaterThan("estimatedAt",startDate);
  punchCardQuery.lessThan("estimatedAt",endDate);
  punchCardQuery.equalTo("status","not_yet"); 
  punchCardQuery.include("ownerPointer");
  punchCardQuery.include("prescriptionPointer");
  punchCardQuery.find({
        success: function(results){

          console.log("punchCardQuery size = " + results.length);
          // Send Push for each sellerBroadcast
          for(var i = 0 ; i < results.length; i++){
            var punchCard = results[i];

            // Query for Group (= careTaker)
            var groupQuery = new Parse.Query("Group"); 
            groupQuery.equalTo("status","verified"); 
            groupQuery.equalTo("ownerPointer",punchCard.get("ownerPointer")); 
            groupQuery.include("caretakerPointer");
            groupQuery.find({
                success: function(groupResults){
                  console.log("groupQuery size = " + groupResults.length);

                  // Send push for each careTaker
                  for(var i = 0 ; i < groupResults.length; i++){
                    var group = groupResults[i];
                    var openType = "caretaker";
                    var openTypeObjectId = punchCard.id;
                    var recipientUserId = group.get("caretakerPointer").id;
                    var message = punchCard.get("ownerPointer").get("name") +  " 忘記吃藥了。" ;
                    var title = "忘記吃藥提醒";

                    // Send Push from cloud code
                    SendPush(recipientUserId,message,title,openType,openTypeObjectId,{
                          success: function(returnValue){
                            console.log("Send Push success");
                          },
                          error: function(error){
                            console.error("Send Push error.");
                          }
                    }); 
                  }

                },
                error: function(error){
                  response.error("Find GroupQuery error. " + error);
                }
            });
          }
          
        },
        error: function(error){
          response.error("Find PunchCard error. " + error);
        }
    });
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
