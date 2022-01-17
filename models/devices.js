var mongoose = require("mongoose");
var Schema = mongoose.Schema;
/* Creates a Device table in Mongo Database.
*/
var SchemaTypes = Schema.Types;
var DeviceSchema = new Schema({
  name:       { type:String,require:true },
  onOff:      { type:String,require:true},
  openClose:  { type:String,require:true },
  temperature:{ type:String,require:true },
  volume:     { type:String,require:true },
  channel:    { type:String,require:true }
});

var Device = mongoose.model("Device", DeviceSchema);

module.exports = Device;
