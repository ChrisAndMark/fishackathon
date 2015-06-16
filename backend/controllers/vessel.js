Vessel = require('../model').Vessel;
User = require('../model').User;

var createVessel = {
  method  : 'POST',
  path    : '/api/v1/vessel',
  config  : {
    auth : {
      strategy: 'token',
    },
    description: 'Create Vessel!',
    notes: 'Returns vessel info after creation:<br/><br/>' +
    '<b>Params:<br/>Vessel Name:</b> &emsp;  vessel_name<br/><b>Vessel Registry Number:</b> &emsp;  vessel_registry_num<br/>' +
    '<b>Vessel Commercial Number:</b> &emsp; vessel_comm_num<br/> <b>Fisher Id Number:</b> &emsp;  fisher_id_number',
    tags: ['api', 'vessel']
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
          if(err.name == "ValidationError"){
            reply(boom.create(422, "Data Validation Error",  { timestamp: Date.now() }));
          }
        }
      });
    });
  }
};

var updateVessel = {
  method  : ['POST', 'PUT'],
  path    : '/api/v1/vessel/update/{id?}',
  config  : {
    auth : {
      strategy: 'token',
    },
    description: 'Update Vessel!',
    notes: 'Returns vessel info after creation:<br/><br/>' +
    '<b>Params:<br/>Vessel Name:</b> &emsp;  vessel_name<br/><b>Vessel Registry Number:</b> &emsp;  vessel_registry_num<br/>' +
    '<b>Vessel Commercial Number:</b> &emsp; vessel_comm_num<br/> <b>Fisher Id Number:</b> &emsp;  fisher_id_number',
    tags: ['api', 'vessel']
  },
  handler : function (request, reply){
    if (request.params.id){
      User.findOne({email: request.auth.credentials.user}, function(err, user) {
        vessel = user.vessels.id(request.params.id);
        vessel.vname = request.payload.vessel_name;
        vessel.vstateregno = request.payload.vessel_registry_num;
        vessel.vcommercialno = request.payload.vessel_comm_num;
        vessel.fisheryIdNo  = request.payload.fisher_id_number;
        user.save(function (err) {
          if (!err) {
            reply(vessel).code(201);    // HTTP 201
          } else {
            console.log(err); // HTTP 403
            if(err.name == "ValidationError"){
              reply(boom.create(422, "Data Validation Error",  { timestamp: Date.now() }));
            }
          }
        });
      });
    }else{
     reply(boom.badRequest("No vessel id passed"));
    }
  }
};

var getVessels = {
  method  : 'GET',
  path    : '/api/v1/vessels',
  config  : {
    auth : {
      strategy: 'token',
    },
    description: 'Returns all vessels from logged in user',
    tags: ['api', 'vessel']
  },
  handler : function (request, reply){
    user = User.findOne({email: request.auth.credentials.user});
    user.select("-vessels.claims");
    user.exec(function (err, user){
      reply(user.vessels);
    });
  }
};

var getVessel= {
  method  : 'GET',
  path    : '/api/v1/vessel/{id?}',
  config  : {
    auth : {
      strategy: 'token',
    },
    description: 'Return parameterized Vessel!',
    notes: 'Returns vessel info from parameter ',
    tags: ['api', 'vessel']
  },
  handler : function (request, reply){
    if (request.params.id){
      user = User.findOne({email: request.auth.credentials.user});
      user.select("-vessels.claims");
      user.exec(function (err, user){
        reply(user.vessels.id(request.params.id));
      });
    }else{
      reply("no id provided");
    }
  }
};


module.exports = {
  createVessel: createVessel,
  updateVessel: updateVessel,
  getVessels: getVessels,
  getVessel : getVessel
};


