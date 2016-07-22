#!/usr/bin/env node

var kue = require('kue')
	, queue = kue.createQueue();
	
console.log("Queue start processing.");
queue.process('say hello', function(job, done) {
	// Start coding
	sayHello()
	
	done();
	process.exit();
});

function sayHello() {
	var startDate = new Date();
	startDate.setMinutes(startDate.getMinutes() - 31 );
	var endDate = new Date();
	endDate.setMinutes(endDate.getMinutes() - 1 );

	console.log("startDate  = " + startDate.toString());
	console.log("endDate  = " + endDate.toString());
}