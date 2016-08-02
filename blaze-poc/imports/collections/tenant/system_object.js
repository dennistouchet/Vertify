import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Match } from 'meteor/check';

export const SystemObjects = new Mongo.Collection('system_objects');

Meteor.methods({
  'system_objects.insert'(objlist, sysid, sysn, wsid) {
    check(objlist, [Number]);
    check(sysid, String);
    check(sysn, String);
    check(wsid, String);

    //check user is logged
    /*
    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    */
    SystemObjects.insert({
      object_list: objlist,
      system_id: sysid,
      system_name: sysn,
      workspace_id: wsid
    });
  },
  'system_objects.remove'(currentid){
    check(currentid, String)
    var current = SystemObjects.findOne(currentid);
    SystemObjects.remove(current._id);
  },
  'system_objects.removeAll'(){
    SystemObjects.remove({});
  },
});

SystemObjects.schema = new SimpleSchema({
  object_list: { type: [Number]
  , optional: true },
  system_id: { type: String },
  system_name: { type: String },
  workspace_id: { type: String },
});
