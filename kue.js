#!/usr/bin/env node

var Parse = require('parse').Parse;
var main = require('./cloud/main');

function pushToCaretaker() {
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
}

pushToCaretaker()

process.exit();