var kue = require('kue')
  , url = require('url');

var kueOptions = {};

if (process.env.REDISTOGO_URL) {
    var redisUrl = url.parse(process.env.REDISTOGO_URL);
    kueOptions.redis = {
        port: parseInt(redisUrl.port),
        host: redisUrl.hostname
    };
    if(redisUrl.auth) {
        kueOptions.redis.auth = redisUrl.auth.split(':')[1];
    }
}

var jobs = kue.createQueue(kueOptions);

// see https://github.com/learnBoost/kue/ for how to do more than one job at a time
jobs.process('crawl', function(job, done) {
  console.log(job.data);
  done();
});
