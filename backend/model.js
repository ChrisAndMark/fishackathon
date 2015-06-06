var Mongoose   = require('mongoose');
var Schema     = Mongoose.Schema;
var validator  = require('validator');
var bcrypt     = require('bcrypt');
var SALT_WORK_FACTOR = 10;


var species_codes = [ 
  "100- Steller (northern) sea lion","101- California sea lion","105- Northern (Pribilof) fur seal","115- Harbor seal","116- Spotted seal", 
  "117- Ringed seal","121- Ribbon seal","124- Gray seal","127- Hawaiian monk seal","129- Northern elephant seal","130- Bearded seal","131- Harp seal",
  "132- Hooded seal (porpoise or dolphin)","203- Unidentified sea lion", "204- Unidentified seal","205- Unidentified pinniped",
  "047- Atlantic white-sided dolphin","049- Pacific white-sided dolphin","053- Common dolphin","054- Bottlenose dolphin", "055- Grampus (Risso’s) dolphin",
   "058- Spotted dolphin","060- Spinner dolphin","061- Striped dolphin","063- Northern right whale dolphin","068- Harbor porpoise","072- Dall’s porpoise",
   "002- North Atlantic right whale", "005- Gray whale","007- Fin whale", "010- Minke whale","011- Humpback whale","012- Sperm whale", "016- Beluga whale",
  "038- False killer whale","039- Killer whale","221- Pilot whale","230- Beaked whale","235- Unidentified small cetacean", "231- Bryde’s whale","232- Dwarf sperm whale",
  "210- Unidentified baleen whale","220- Unidentified toothed whale"
];

var injury_codes = [
  "01 - Visible blood flow",
  "02- Loss of/damage to appendage/jaw",
  "03- Inability to use appendage(s)",
  "04- Asymmetry in shape of body or body position", 
  "05- Any noticeable swelling or hemorrhage (bruising)", 
  "06- Laceration (deep cut)",   
  "07- Rupture or puncture of eyeball", 
  "08- Listlessness or inability to defend",
  "09- Inability to swim or dive",
  "10- Equilibrium imbalance",
  "11- Ingestion of gear",
  "12- Released trailing gear/gear perforating body",
  "13- Other wound or injury",
  "14- Killed" 
];

var speciesSchema = new Schema({
  scode         : { type: String, required: true, enum: species_codes },
  injurycode    : { type: String, required: true, enum: injury_codes }, 
  numinjured    : { type: Number, min: 1, required: true }
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
  claims         : [ claimSchema ]
});


var userSchema = new Schema({
  email         : { type: String, required: true, index: { unique: true }, validate: [ validator.isEmail, 'invalid email' ]  },
  password      : { type: String, required: true },
  fname         : { type: String, required: true, trim: true },
  lname         : { type: String, required: true, trim: true}, 
  address       : { type: String, required: true, trim: true}, 
  city          : { type: String, required: true, trim: true}, 
  state         : { type: String, required: true, trim: true}, 
  zip           : { type: Number, min: 10000, max: 99999, required: true}, 
  fisheryIdNo   : { type: Number, min: 100, max: 999, required: true}, 
  vessels       : [vesselSchema],
  session       : { type: String, required: false }
});



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
vesselSchema.set('autoIndex', false)
speciesSchema.set('autoIndex', false)
claimSchema.set('autoIndex', false)
userSchema.set('autoIndex', false);


var user = Mongoose.model('user', userSchema);
var vessel = Mongoose.model('vessel', vesselSchema)
var claims = Mongoose.model('claims', claimSchema)

module.exports = {
  User: user,
  Vessel: vessel, 
  Claims: claims
};