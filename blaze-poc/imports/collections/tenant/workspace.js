import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Workspaces = new Mongo.Collection('workspaces');

Meteor.methods({
  'workspaces.insert'(text) {
    check(text, String);

    //check user is logged
    /*
    if(! this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    */


    //TODO: Update after accounts are implemented
    //Temporary solution to incrementing ID's until user accounts are implemented
    var strid = Workspaces.findOne({}, {sort: {id: -1}});
    if(strid == null) {
      var intid = 111111;
    }
    else {
      var intid = (parseInt(strid.id) + 111111);
    }

    Workspaces.insert({
      name: text, 
      tenant_id: intid.toString(),
      id: intid.toString(),
      created: new Date(),
      modified: new Date(),
      group_id: intid.toString()
    });
  },
  'workspaces.remove'(currentid){
    check(currentid, String);


    var current = Workspaces.findOne(currentid);
    //TODO: Check if Workspace has Systems, cancel delete if true
    //TODO: Add userid security
    Workspaces.remove(current._id);
  },
  'workspaces.edit'(id, name){
    check(id, String);
    check(name, String);

    Workspaces.update(id, {$set: {name: name, modified: new Date()}})
  },
});

Workspaces.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
  id:
    { type: String },
  modified:
    { type: Date },
  created:
    { type: Date },
  is_deleted:
    { type: Boolean
      , optional: true },
  is_archived:
    { type: Boolean
      , optional: true },
  name:
    { type: String },
  group_id:
    { type: String }
});
