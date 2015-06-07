Vessel = require('../model').Vessel
User = require('../model').User

var createVessel = {
  method  : 'POST',
  path    : '/api/v1/vessel',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply) {
    User.findOne({email: request.auth.credentials.user}, function(err, user) {
      var vessel = new Vessel();
      vessel.vname = request.payload.vessel_name; 
      vessel.vstateregno = request.payload.vessel_registry_num; 
      vessel.vcommercialno = request.payload.vessel_comm_num;
      vessel.fisheryIdNo  = request.payload.fisher_id_number; 
      user.vessels.push(vessel);
      user.save(function (err) {
        if (!err) {

            reply(vessel).created('/vessel/' + vessel._id);    // HTTP 201
        } else {
            console.log(err); // HTTP 403
            reply(err);
        }
      })
    })
  }
};
var updateVessel = {
  method  : ['POST', 'PUT'],
  path    : '/api/v1/vessel/update',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply){

    reply('yooooo')
  }
};

var getVessels = {
  method  : 'GET',
  path    : '/api/v1/vessels',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply){
    user = User.findOne({email: request.auth.credentials.user})
    user.select("-vessels.claims")
    user.exec(function (err, user){ 
      reply(user.vessels);
    })
  }
};

var getVessel= {
  method  : 'GET',
  path    : '/api/v1/vessel/{id?}',
  config  : {
    auth : {
      strategy: 'token',
    }
  },
  handler : function (request, reply){
    if (request.params.id){
      user = User.findOne({email: request.auth.credentials.user})
      user.select("-vessels.claims")
      user.exec(function (err, user){ 
        reply(user.vessels.id(request.params.id));
      })
    }else{
      reply("no id provided")
    } 
  }
};


module.exports = {
  createVessel: createVessel, 
  updateVessel: updateVessel, 
  getVessels: getVessels, 
  getVessel : getVessel}


