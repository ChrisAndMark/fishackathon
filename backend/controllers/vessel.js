Vessel = require('../model').Vessel

var createUser = {
  method  : 'POST',
  path    : '/api/v1/vessel',
  handler : function (request, reply) {
    var vessel = new Vessel();
    vessel.vname = request.payload.vessel_name; 
    vessel.vstateregno = request.payload.vessel_registry_num; 
    vessel.vcommercialno = request.payload.vessel_comm_num;
    vessel.save(function (err) {
      if (!err) {

          reply(user).created('/user/' + user._id);    // HTTP 201
      } else {
          console.log(err); // HTTP 403
          reply(err);
      }
    })
    }
  };
var updateUser = {
  method  : ['POST', 'PUT'],
  path    : '/api/v1/user/update',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply){
    console.log(request)
    reply('yooooo')
  }
};


module.exports = {createUser: createUser, updateUser: updateUser}