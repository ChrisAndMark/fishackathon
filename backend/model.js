var Mongoose   = require('mongoose');
var Schema     = Mongoose.Schema;
var validator  = require('validator');
var bcrypt     = require('bcrypt');
var uniqueValidator = require('mongoose-unique-validator');
var SALT_WORK_FACTOR = 10;



var species_codes = ["100","101","105","115","116","117","121","124","127","129","130","131","132","203","204","205","047","049","053","054","055","058","060","061","063","068","072","002","005","007","010","011","012","016","038","039","221","230","235","231","232","210","220"];
var injury_codes = ["01","02","03","04","05","06","07","08","09","10","11","12","13","14"];

var speciesSchema = new Schema({
  scode         : { type: String, required: true, enum: species_codes },
  injurycode    : { type: String, required: true, enum: injury_codes },
  numInjured    : { type: Number, min: 1, required: true }
});

var claimSchema = new Schema ({
  fisherygear   : { type: String, required: true, trim: true },
  targetSpecies : { type: String, required: true, trim: true },
  datetime      : { type: Date, default: Date.now },
  loc_long      : { type: Number, required: true }, //long, lat
  loc_lat       : { type: Number, required: true },
  type          : { type: String, required: true, enum: ["incidental", "intentional"] },
  species       : [ speciesSchema ],
  notes         : { type: String, trim: true}
});

var vesselSchema = new Schema({
  vname          : { type: String, required: true, trim: true },
  vstateregno    : { type: Number, min: 100, max: 99999999 },
  vcommercialno  : { type: Number, min: 100, max: 999999 },
  fisheryIdNo    : { type: Number, min: 100, max: 999, required: true},
  claims         : [ claimSchema ]
});


var userSchema = new Schema({
  email         : { type: String, required: true, unique: true, validate: [ validator.isEmail, 'invalid email' ]  },
  password      : { type: String, required: true },
  fname         : { type: String, required: true, trim: true },
  lname         : { type: String, required: true, trim: true},
  address       : { type: String, required: true, trim: true},
  city          : { type: String, required: true, trim: true},
  state         : { type: String, required: true, trim: true},
  zip           : { type: Number, min: 10000, max: 99999, required: true},
  vessels       : [vesselSchema],
  session       : { type: String, required: false }
});

userSchema.plugin(uniqueValidator);



userSchema.pre('save', function(next) {
    var user = this;

    // only hash the password if it has been modified (or is new)
    if (!user.isModified('password')) return next();

    // generate a salt
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        // hash the password along with our new salt
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            // override the cleartext password with the hashed one
            user.password = hash;
            next();
        });
    });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


//Removing autoindexing for prod
vesselSchema.set('autoIndex', false);
speciesSchema.set('autoIndex', false);
claimSchema.set('autoIndex', false);
userSchema.set('autoIndex', false);


var user = Mongoose.model('user', userSchema, 'user');
var vessel = Mongoose.model('vessel', vesselSchema, 'vessel');
var claim = Mongoose.model('claim', claimSchema, 'claim');
var species = Mongoose.model('species', speciesSchema, 'species');
module.exports = {
  User: user,
  Vessel: vessel,
  Claims: claim,
  Species: species
};