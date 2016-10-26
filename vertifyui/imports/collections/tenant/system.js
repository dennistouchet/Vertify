import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { ExternalObjects } from './external_object.js';

export const Systems = new Mongo.Collection('systems');

Meteor.methods({
  'systems.insert'(wsid, connid, nm, pf, maxtasks, cred) {
    check(wsid, Number);
    check(connid, Number);
    check(nm, String);
    check(pf, String);
    var maxtask = parseInt(maxtasks);
    check(maxtask, Number);
    //Validate Credentials
    for(i = 0; i < cred.length; i++){
      SystemSettingsSchema.validate(cred[i]);
    }
    //check user is logged
    /*
    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    */

    // Incrementing ID's
    var lastSys = Systems.findOne({}, {sort: {id: -1}});
    if(lastSys == null) {
      var intid = 111111;
    }
    else {
      var intid = (lastSys.id + 111111);
    }

    var snexists = Systems.findOne({"name" : nm });
    var pfexists = Systems.findOne({"prefix" : pf });
    if(snexists) {
      throw new Meteor.Error("Value Exists", "There was an error processing your request. System name already exists.");
    }
    else if(pfexists){
      throw new Meteor.Error("Value Exists", "There was an error processing your request. System prefix already exists.");
    }

    // Call Task to get external objects
    //TODO: Add isDevelopment check to this when tasks are complete on Elixir side
    //TODO: MOVE THIS CALL INTO MOCK LOADING PROGRESS for collect for simulation
     var eolist = Meteor.tools.getExternalObjects(wsid, connid);
     for(i=0;i< eolist.length;i++)
     {
       SystemExternalObjectsSchema.validate(eolist[i]);
     }

    var newSystem = {
      name: nm,
      tenant_id: wsid,
      id: intid,
      created: new Date(),
      modified: new Date(),
      is_deleted: false,
      workspace_id: wsid,
      connector_id: connid,
      last_scanned: new Date(),
      max_concurrent_tasks: maxtask,
      prefix: pf,
      agent_id: wsid.toString(),
      credentials: cred,
      external_objects: eolist
    };

    Systems.schema.validate(newSystem);
    var systemval = Systems.insert(newSystem);
    return intid;
  },
  'systems.remove'(currentid, wsid){
    check(currentid, String)

    var current = Systems.findOne(currentid);
    // Check if System has objects, cancel delete if true
    var objectCount = ExternalObjects.find({"system_id": current.id}).count();
    if(objectCount > 0){
      throw new Meteor.Error("Existing Dependencies", "There was an error deleting the System. All system objects must be deleted from a system before it can be removed.");
    }

    //TODO: Add userid security
    Systems.remove(current._id);
  },
  'systems.edit'(id, system, pf, maxtasks, cred, wsid){
    check(id, String);
    check(system, String);
    check(pf, String);
    check(maxtasks, Number);
    for(i = 0; i < cred.length; i++){
      SystemSettingsSchema.validate(cred[i]);
    }

    Systems.update(id, {$set: {name: system
                  , modified: new Date(), prefix: pf
                  , max_concurrent_tasks: maxtasks, credentials: cred}});
    var sys = Systems.findOne(id);
    return sys.id;
  },
  'systems.updateStatus'(wsid, sysid, field, status){
    check(wsid, Number);
    check(sysid, Number);
    check(field, String);
    check(status, Boolean);

    var sys = Systems.findOne({workspace_id: wsid, id:sysid});
    if(field == "authentication"){
      return Systems.update(sys._id, {$set: { authentication: true, modified: new Date()}});
    }else if(field == "discover"){
      return Systems.update(sys._id, {$set: { discover: true, modified: new Date()}});
    }
  },
});

export const SystemSettingsSchema = new SimpleSchema({
  setting:
  { type: String },
  value:
  { type: String }
})

export const SystemExternalObjectsSchema = new SimpleSchema({
  name:
  { type: String },
  is_dynamic:
  { type: Boolean },
  generic_string_1:
    { type: String
    , optional: true },
  generic_string_2:
    { type: String
    , optional: true },
  generic_string_3:
    { type: String
    , optional: true },
  generic_integer_1:
    { type: Number
    , optional: true },
  generic_integer_2:
    { type: Number
    , optional: true },
  generic_integer_3:
    { type: Number
    , optional: true },
})


Systems.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: Number },
  modified:
    { type: Date
      , label: "Modified Date" },
  created:
    { type: Date
      , label: "Created Date" },
  is_deleted:
    { type: Boolean
      , optional:true },
  name:
    { type: String },
  workspace_id:
    { type:  Number },
  connector_id:
    { type: Number },
  authentication:
    { type: Boolean
    , optional: true },
  discover:
    { type: Boolean
    , optional: true }
  ,  last_scanned:
    { type: Date
      , label: "Last Scanned Date"
      , optional:true },
  max_concurrent_tasks:
    { type: Number
      , defaultValue: 0
      , min: 0 },
  prefix:
    { type: String
      , max: 3 },
  agent_id:
    { type: String
      , optional:true} ,
  credentials:
    { type: [SystemSettingsSchema]
    , optional:true },
  settings:
    { type: [SystemSettingsSchema]
    , optional:true },
  external_objects:
    { type: [SystemExternalObjectsSchema]
      , optional:true }
});
