// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var kue = require('kue');
var url = require('url');

var ParseServer = require('parse-server').ParseServer;
var path = require('path');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || '', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
  fileKey: process.env.FILE_KEY || 'optionalFileKey', // For migrated apps, this is necessary to provide access to files already hosted on parse.com
  liveQuery: {
    classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));

// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

// Parse Server plays nicely with the rest of your web routes
app.get('/', function(req, res) {
  res.status(200).send('I dream of being a website.  Please star the parse-server repo on GitHub!');
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

// This will enable the Live Query real-time server
ParseServer.createLiveQueryServer(httpServer);

kue.redis.createClient = function() {
    var redisUrl = url.parse(process.env.REDISTOGO_URL)
      , client = redis.createClient(redisUrl.port, redisUrl.hostname);
    if (redisUrl.auth) {
        client.auth(redisUrl.auth.split(":")[1]);
    }
    return client;
};

// then access the current Queue
var jobs = kue.createQueue();

app.get('/', function(req, res) {
    
    var job = jobs.create('crawl', {
        url: 'http://github.com'
    });

    job.on('complete', function(){
        // avoid sending data after the response has been closed
        if (res.finished) {
            console.log("Job complete");
        } else {
            res.send("Job complete");
        }
    }).on('failed', function(){
        if (res.finished) {
            console.log("Job failed");
        } else {
            res.send("Job failed");
        }
    }).on('progress', function(progress){
        console.log('job #' + job.id + ' ' + progress + '% complete');
    });
    
    job.save();

    // timeout after 5s
    setTimeout(function() {
        res.send("OK (timed out)");
    }, 5000);
});

// wire up Kue (see /active for queue interface)
app.use("kue", kue.app);
