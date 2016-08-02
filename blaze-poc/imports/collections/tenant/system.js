import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Systems = new Mongo.Collection('systems');
export const SystemSettings = new Mongo.Collection('systemsettings')

Meteor.methods({
  'systems.insert'(wsid, sysid, system, pf, st, un, pw, maxtasks) {
    check(wsid, String);
    check(sysid, String);
    check(system, String);
    check(pf, String);
    check(st, String);
    check(un, String);
    check(pw, String);
    var maxtask = parseInt(maxtasks);
    check(maxtask, Number);

    //check user is logged
    /*
    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    */
    //TODO: Update after accounts are implemented
    //Temporary solution to incrementing ID's until user accounts are implemented
    var lastSys = Systems.findOne({}, {sort: {id: -1}});
    if(lastSys == null) {
      var intid = 111111;
    }
    else {
      var intid = (parseInt(lastSys.id) + 111111);
    }

    Systems.insert({
      name: system,
      tenant_id: wsid,
      id: intid.toString(),
      created: new Date(),
      modified: new Date(),
      id_deleted: false,
      workspace_id: wsid,
      connector_id: sysid,
      system_type: st,
      username: un,
      password: pw,
      dynamic_wsdl_assembly: "",
      last_scanned: new Date(),
      max_concurrent_tasks: maxtask,
      prefix: pf,
      agent_id: wsid,
      settings: {},
      rev_number: "0.0.0.1"

    });
  },
  'systems.remove'(currentid){
    check(currentid, String)

    var current = Systems.findOne(currentid);
    //TODO: Check if System has objects, cancel delete if true
    //TODO: Add userid security
    Systems.remove(current._id);
  },
  'systems.edit'(id, system, pf, st, un, pw, maxtasks){
    check(id, String);
    check(system, String);
    check(pf, String);
    check(st, String);
    check(un, String);
    check(pw, String);
    check(maxtasks, Number);

    Systems.update(id, {$set: {name: system
                  , modified: new Date(), prefix: pf
                  , system_type: st, username: un
                  , password: pw, max_concurrent_tasks: maxtasks}})
  },
});

Systems.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: String
      , optional:true },
  modified:
    { type: Date
      , label: "modifieddate" },
  created:
    { type: Date
      , label: "createddate" },
  is_deleted:
    { type: Boolean
      , optional:true },
  workspace_id:
    { type: String },
  name:
    { type: String },
  connector_id:
    { type: String },
  system_type:
    { type: String },
  username:
    { type: String },
  password:
    { type: String },
  dynamic_wsdl_assembly:
    { type: String },
  last_scanned:
    { type: Date
      , label: "last_scanneddate"
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
  //TODO: Create Settings Array fields (i.e. "settings.$." )
  settings:
    { type: Object
      , optional:true },
  rev_number:
    { type: String
      , optional:true }
});

SystemSettings.Schema = new SimpleSchema({

})
