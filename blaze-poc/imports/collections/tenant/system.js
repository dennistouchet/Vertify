import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Objects } from './object.js';

export const Systems = new Mongo.Collection('systems');
export const SystemSettings = new Mongo.Collection('systemsettings')

Meteor.methods({
  'systems.insert'(wsid, sysid, nm, pf, st, un, pw, maxtasks) {
    check(wsid, String);
    check(sysid, String);
    check(nm, String);
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

    //TODO: decide if this should have duplicate existance on front/back end.
    var snexists = Systems.findOne({"name" : nm });
    var pfexists = Systems.findOne({"prefix" : pf });
    if(snexists) {
      throw new Meteor.Error("Value Exists", "There was an error processing your request. System name already exists.");
    }
    else if(pfexists){
      throw new Meteor.Error("Value Exists", "There was an error processing your request. System prefix already exists.");
    }
    /*else if(pf.length > 3)
    {
      throw new Meteor.error();
    }*/
    var newSystem = {
      name: nm,
      tenant_id: parseInt(wsid),
      id: intid.toString(),
      created: new Date(),
      modified: new Date(),
      is_deleted: false,
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
    };

    Systems.schema.validate(newSystem);

    Systems.insert(newSystem);
  },
  'systems.remove'(currentid){
    check(currentid, String)

    var current = Systems.findOne(currentid);
    // Check if System has objects, cancel delete if true
    var objectCount = Objects.find({"system_id": current.id}).count();
    if(objectCount > 0){
      throw new Meteor.Error("Existing Dependencies", "There was an error deleting the System. All system objects must be deleted from a system before it can be removed.");
    }

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

    //Systems.schema.validate();

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
    { type: String },
  modified:
    { type: Date
      , label: "Modified Date" },
  created:
    { type: Date
      , label: "Created Date" },
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
