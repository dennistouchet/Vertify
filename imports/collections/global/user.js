import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { KVPairSchema } from './kvpair.js';

//TODO: figure out why these won't run from this location
/*
Meteor.methods({
  'userEdit'(userId, options, config){
    check(options, Object);
    check(config, Object);
    console.log("todo: user edit");

    Meteor.users.update(userId, { $set: {"testVal": "todaysVal"}});
  },
  'userRemove'(userId){
    console.log("users.remove called with user: ", userId);

    return Meteor.users.remove(userId);
  }
});*/
Meteor.methods({
  'users.updateRoles'(tntId, wsId, userId, rolesToAdd, rolesToRemove){
    check(tntId, String);
    check(wsId, String);
    check(userId, String);
    check(rolesToAdd, Array);
    check(rolesToRemove, Array);

    if(! this.userId) {
      throw new Meteor.Error(403, 'Unauthorized', 'The current user is not authorized to perform this action. ['+ arguments.callee.name +']');
    }

    var i = rolesToAdd.indexOf('super-admin');
    if(i > -1)
      rolesToAdd.splice(i, 1);

    var j = rolesToRemove.indexOf('super-admin');
    if(j > -1)
      rolesToRemove.splice(j, 1);

    if(Roles.userIsInRole(this.userId, 'super-admin') ||
        Roles.userIsInRole(this.userId, 'admin', tnt_id)){

      Roles.addUsersToRoles(userId, rolesToAdd, tntId);
      Roles.removeUsersFromRoles(userId, rolesToRemove, tntId);
    }
    else{
      throw new Meteor.Error(403, 'Unauthorized', 'The current user is not authorized to perform this action. ['+ arguments.callee.name +']');
    }
  }
});

export const PageState = new SimpleSchema({
  tab:
  { type: String },
  kv_fields:
  {
    //Currentl Only String
    type: [KVPairSchema],
    optional: true
  }
});

export const UserConfigurationSchema = new SimpleSchema({
    workspace:
    { type: String },
    route:
    { type: String },
    subdomain:
    { type: String,
    optional: true },
    connect:
    { type: PageState
    , optional: true },
    collect:
    { type: PageState
    , optional: true },
    match:
    { type: PageState
    , optional: true },
    align:
    { type: PageState
    , optional: true }
});
