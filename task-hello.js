#!/usr/bin/env node

var Parse = require('parse/node');
Parse.initialize("30718c2b47204ebda11553761e2c7c12", "cae9736ab3ac48a095c19b9351902fe0", "dbc5df5dc3314a36a18dbc792e68f66e");
Parse.serverURL = "https://estimote-indoor-soleil.herokuapp.com/parse";
Parse.Cloud.useMasterKey();

// Simple test for hello
Parse.Cloud.run('hello', {}).then(function(result) {
    // make sure the set the enail sent flag on the object
    console.log("hello result :" + JSON.stringify(result));
}, function(error) {
    // error
    console.log("error: "+error);
});

// Check and log object
Parse.Cloud.run('QueryBeaconSpot', {}).then(function(result) {
    console.log("QueryBeaconSpot result :" + JSON.stringify(result));
}, function(error) {
    // error
    console.log("error: "+error);
});