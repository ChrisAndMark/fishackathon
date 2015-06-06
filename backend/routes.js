var Boom = require('boom');

var routes = [{
  method: 'GET',
  path:'/api/v1/proxy',
  handler: function (request, reply) {
      reply("Hello world");
    }
  }
];

module.exports = routes;