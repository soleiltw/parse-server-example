var kue = require('kue');

var jobs = kue.createQueue({
  redis: process.env.REDISTOGO_URL
});

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('crawl', function(job, done) {
  console.log(job.data);
  done();
});
