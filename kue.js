var kue = require('kue');
var redisUrl =  require("url").parse(process.env.REDISTOGO_URL);

var redisOptions = {
    host: redisUrl.hostname,
    port: parseInt(redisUrl.port),
    auth: redisUrl.auth.split(":")[1]
}

var jobs = kue.createQueue(redisOptions);

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('crawl', function(job, done) {
  console.log(job.data);
  done();
});
