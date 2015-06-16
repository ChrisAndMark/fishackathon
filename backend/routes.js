var Boom = require('boom');
var User   = require('./model').User;

var userRoutes = require('./controllers/user');
var vesselRoutes = require('./controllers/vessel');
var claimRoutes = require('./controllers/claim');


var routes = [];
routes.push(userRoutes.getUser);
routes.push(userRoutes.createUser);
routes.push(userRoutes.updateUser);
routes.push(userRoutes.userExist);
routes.push(userRoutes.loginUser);
routes.push(userRoutes.logoutUser);

routes.push(vesselRoutes.createVessel);
routes.push(vesselRoutes.updateVessel);
routes.push(vesselRoutes.getVessels);
routes.push(vesselRoutes.getVessel);

routes.push(claimRoutes.createClaim);
routes.push(claimRoutes.updateClaim);

module.exports = routes;