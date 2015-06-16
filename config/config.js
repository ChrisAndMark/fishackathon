var privateKey = 'BbZJjyoXAdr8BUZuiKKARWimKfrSmQ6fv8kZ7OFfc';
var uristring = "mongodb://localhost:27017"

var species_code_descrip  = { 
  "100" : "Steller (northern) sea lion",
  "101" : "California sea lion",
  "105" : "Northern (Pribilof) fur seal",
  "115" : "Harbor seal",
  "116" : "Spotted seal",
  "117" : "Ringed seal",
  "121" : "Ribbon seal",
  "124" : "Gray seal",
  "127" : "Hawaiian monk seal",
  "129" : "Northern elephant seal",
  "130" : "Bearded seal",
  "131" : "Harp seal",
  "132" : "Hooded seal (porpoise or dolphin)",
  "203" : "Unidentified sea lion",
  "204" : "Unidentified seal",
  "205" : "Unidentified pinniped",
  "047" : "Atlantic white-sided dolphin",
  "049" : "Pacific white-sided dolphin",
  "053" : "Common dolphin",
  "054" : "Bottlenose dolphin",
  "055" : "Grampus (Risso’s) dolphin",
  "058" : "Spotted dolphin",
  "060" : "Spinner dolphin",
  "061" : "Striped dolphin",
  "063" : "Northern right whale dolphin",
  "068" : "Harbor porpoise",
  "072" : "Dall’s porpoise",
  "002" : "North Atlantic right whale",
  "005" : "Gray whale",
  "007" : "Fin whale",
  "010" : "Minke whale",
  "011" : "Humpback whale",
  "012" : "Sperm whale",
  "016" : "Beluga whale",
  "038" : "False killer whale",
  "039" : "Killer whale",
  "221" : "Pilot whale",
  "230" : "Beaked whale",
  "235" : "Unidentified small cetacean",
  "231" : "Bryde’s whale",
  "232" : "Dwarf sperm whale",
  "210" : "Unidentified baleen whale",
  "220" : "Unidentified toothed whale"
};

var injury_code_descrip = {
  "01" : "Visible blood flow",
  "02" : "Loss of/damage to appendage/jaw",
  "03" : "Inability to use appendage(s)",
  "04" : "Asymmetry in shape of body or body position", 
  "05" : "Any noticeable swelling or hemorrhage (bruising)", 
  "06" : "Laceration (deep cut)",   
  "07" : "Rupture or puncture of eyeball", 
  "08" : "Listlessness or inability to defend",
  "09" : "Inability to swim or dive",
  "10" : "Equilibrium imbalance",
  "11" : "Ingestion of gear",
  "12" : "Released trailing gear/gear perforating body",
  "13" : "Other wound or injury",
  "14" : "Killed"
};


module.exports = {pk: privateKey, mongoUri: uristring};