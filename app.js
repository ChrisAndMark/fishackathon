var path        = require('path'),
    Hapi        = require('hapi'),
    boom        = require('boom'),
    routes      = require(path.join(process.cwd(), '/backend/routes.js')),
    config      = require('./config/config'),
    validate    = require('./backend/lib/validate').validate,
    jwt         = require('jsonwebtoken'),
    Mongoose    = require('mongoose'),
    isTest      = process.env.NODE_ENV === 'test';

Mongoose.connect(config.mongoUri, function(err, resp){
  if (err) {
    console.log ('ERROR connecting to: ' + config.mongoUri + '. ' + err);
  } else {
    if (!isTest) console.log ('Succeeded connected to: ' + config.mongoUri);
  }
});

// Create a server with a host and port
var server = new Hapi.Server();
server.connection({
    host: '127.0.0.1',
    port: process.env.PORT || 3000
});

// Setup Good config for Hapi
var goodConfig = {
  register: require('good'),
  options: {
    opsInterval: 1000,
    reporters: [{
      reporter: require('good-console'),
      events: { log: '*', response: '*' }
    }, 
    {
      reporter: 'good-http',
      events: { log: '*', error: '*' },
      config: {
        endpoint: 'http://prod.logs:3000',
        wreck: {
            headers: { 'x-api-key' : 12345 }
        }
      }
    }]
  }
};

server.register(require('hapi-auth-jwt'), function () {
  server.auth.strategy('token', 'jwt', { key: config.pk,  validateFunc: validate });
});

// Register the default route that will dump the index file
server.route({
  method: 'GET',
  path:'/',
  handler: function (request, reply) {
    reply.file(path.join(process.cwd(), '/backend/views/index.html'));
  }
});

// Serve static files
server.route({
  method: 'GET',
  path: '/{param*}',
  handler: {
    directory: {
      path: path.join(process.cwd(), '/.tmp'),
    }
  }
});

// Load the rest of the routes
server.route(routes);

// Register the Good config that we setup
if (!isTest) {
  server.register(goodConfig, function(err) {
    if (err) {
      console.error(err);
    }
  });
}

if (!isTest) {
  server.register({ register: require('lout') }, function(err) {
  });
}

// Start the server
server.start(function (err)  {
  if (!isTest) console.log("Server started at", server.info.uri);
});

module.exports = {
  App: server,
  Mongoose: Mongoose
};