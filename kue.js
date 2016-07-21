#!/usr/bin/env node

// Using Heroku Scheduler with Node.js http://stackoverflow.com/questions/13345664/using-heroku-scheduler-with-node-js
function sayHello() {
	console.log('Hello from kue.js');
}
sayHello();

// An example for - In Node.js, how do I “include” functions from my other files? http://stackoverflow.com/questions/5797852/in-node-js-how-do-i-include-functions-from-my-other-files
var tools = require('./cloud/tools');
tools.foo()
tools.bar()
console.log(typeof tools.zemba);
