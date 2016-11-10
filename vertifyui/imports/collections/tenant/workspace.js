import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Systems } from './system.js';

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
    //TODO: REMOVE THIS - Update after accounts are implemented
    //Temporary solution to incrementing ID's until user accounts are implemented
    var wrkid = Workspaces.findOne({}, {sort: {tenant_id: -1}});
    if(wrkid == null) {
      var intid = 111111;
    }
    else {
      var intid = (wrkid.tenant_id + 111111);
    }

    //Verify Workspace name doesn't exist, else throw error
    var count = Workspaces.find({"name" : text}).count();
    //TODO: VERIFY THIS WORKS
    if(count > 0) {
      throw new Meteor.Error( "Value Exists", "There was an error processing your request. Workspace name already exists.");
    }

    var newWorkspace = {
      name: text,
      tenant_id: intid,
      created: new Date(),
      modified: new Date(),
      group_id: intid
    };

    Workspaces.schema.validate(newWorkspace)
    return Workspaces.insert(newWorkspace);

  },
  'workspaces.remove'(current_id){
    check(current_id, String);
    var current = Workspaces.findOne(current_id);

    // See if systems exist for the current workspace, if they do, prevent removal
    var systemCount = Systems.find({"workspace_id": current._id}).count();
    if(systemCount > 0){
      throw new Meteor.Error("Existing Dependencies", "There was an error deleting the Workspace. All systems must be deleted from a workspace before it can be removed.");
    }
    //TODO: Add userid security
    Workspaces.remove(current._id);
  },
  'workspaces.edit'(_id, text){
    check(_id, String);
    check(text, String);

    //Verify Workspace name doesn't exist, else throw error
    //TODO: VERIFY WORKSPACE NAME AND PREFIX
    var count = Workspaces.find({"_id": _id, "name" : text}).count();
    if(count > 0) {
      throw new Meteor.Error( "Value Exists", "There was an error processing your request. Workspace name already exists.");
    }

    Workspaces.update(_id, {$set: {name: text, modified: new Date()}});
  },
});

Workspaces.schema = new SimpleSchema({
  tenant_id:
    { type: Number },
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
    { type: Number }
});
